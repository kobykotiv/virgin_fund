import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySessionToken, COOKIE_NAME, requireRecentSession } from "@/lib/session";

type UploadResult = {
  name: string;
  path?: string;
  size?: number;
  type?: string;
  error?: string | null;
  record?: any;
};

export async function POST(req: NextRequest) {
  // Expected behavior:
  // - Require a valid server session (omitted here; caller must protect route or implement session check)
  // - Parse multipart/form-data and upload each file to Supabase Storage 'cms' bucket
  // - Insert a `designs` row for each uploaded file and associate with optional collection_id
  // - Return per-file status and created DB records

  try {
    const supabase = getSupabaseAdmin();

    // Validate session from cookie or Authorization header
    const cookieToken = req.cookies.get(COOKIE_NAME)?.value ?? null;
    const authHeader = req.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
    const token = cookieToken ?? bearer;

    const session = await verifySessionToken(token ?? "", supabase as any);
    if (!session || (session as any).expired) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401 });
    }

    try {
      // enforce recent session (maxAge 15 minutes)
      requireRecentSession(session as any, 15 * 60 * 1000);
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "session_too_old" }), { status: 403 });
    }

    const form = await req.formData();
    const files = form.getAll("files");
    const optionsRaw = form.get("options") as string | null;
    const options = optionsRaw ? JSON.parse(optionsRaw) : {};
    const collectionId = options.collectionId ?? null;

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ uploaded: 0, failed: 0, files: [] }), { status: 400 });
    }

    const results: UploadResult[] = [];

    for (const f of files as any[]) {
      try {
        const file = f as File;
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

        // Upload to Supabase Storage bucket named 'cms'
        const { data: uploadData, error: uploadErr } = await supabase.storage.from("cms").upload(filename, file.stream(), {
          cacheControl: "3600",
          upsert: false,
        } as any);

        if (uploadErr || !uploadData) {
          results.push({ name: file.name, size: file.size, type: file.type, error: String(uploadErr?.message ?? uploadErr) });
          continue;
        }

        const publicUrl = supabase.storage.from("cms").getPublicUrl(uploadData.path).data?.publicUrl;

        // insert a designs record
        const payload: any = {
          name: file.name,
          file_path: uploadData.path,
          url: publicUrl ?? null,
          size: file.size,
          content_type: file.type,
          collection_id: collectionId,
        };

        const { data: inserted, error: insertErr } = await supabase.from("designs").insert([payload]).select().maybeSingle();

        if (insertErr) {
          // If `designs` table doesn't exist or insertion failed, fallback to logging the upload into webhook_logs
          try {
            await supabase.from("webhook_logs").insert([{ source: "cms_bulk_upload", payload, headers: Object.fromEntries(req.headers), created_at: new Date().toISOString() }]);
          } catch (wErr) {
            // swallow fallback error
          }

          results.push({ name: file.name, size: file.size, type: file.type, path: uploadData.path, error: String(insertErr.message ?? insertErr) });
          continue;
        }

        results.push({ name: file.name, path: uploadData.path, size: file.size, type: file.type, error: null, record: inserted });
      } catch (e: any) {
        results.push({ name: (f as any)?.name ?? "unknown", error: String(e) });
        continue;
      }
    }

    const uploaded = results.filter((r) => !r.error).length;
    const failed = results.length - uploaded;

    return new Response(JSON.stringify({ uploaded, failed, files: results }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ uploaded: 0, failed: 0, files: [], errors: [{ file: "all", message: String(e) }] }), { status: 500 });
  }
}
