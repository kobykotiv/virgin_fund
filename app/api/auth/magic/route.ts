import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const redirectTo = site ? `${site}/dashboard` : undefined;

    // Trigger Supabase to send a magic link (signInWithOtp)
    const { error } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });

    if (error) {
      console.error("Magic link send failed:", error.message || error);
      return NextResponse.json({ error: "Could not send magic link" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Magic link error:", err);
    return NextResponse.json({ error: "Could not send magic link" }, { status: 500 });
  }
}
