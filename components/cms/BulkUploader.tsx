"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { BulkUploadOptions } from "@/types/cms";

type FileProgress = {
  file: File;
  preview?: string | null;
  progress: number; // 0-100
  status: "pending" | "uploading" | "done" | "error";
  error?: string | null;
  record?: any;
};

export default function BulkUploader({ collectionId }: { collectionId?: string }) {
  const [items, setItems] = useState<FileProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const hasFiles = items.length > 0;

  const revokePreviews = useCallback(() => {
    items.forEach((i) => { if (i.preview) URL.revokeObjectURL(i.preview); });
  }, [items]);

  const onFiles = useCallback((files: FileList | null) => {
    revokePreviews();
    if (!files) { setItems([]); return; }
    const arr: FileProgress[] = Array.from(files).map((f) => ({ file: f, preview: URL.createObjectURL(f), progress: 0, status: "pending" }));
    setItems(arr);
  }, [revokePreviews]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiles(e.target.files);
  }, [onFiles]);

  const clear = useCallback(() => { revokePreviews(); setItems([]); }, [revokePreviews]);

  const uploadAll = useCallback(async () => {
    if (items.length === 0) return;
    setUploading(true);

    const opts: BulkUploadOptions = { collectionId, overwrite: false };
    const CONCURRENCY = 4; // configurable parallel uploads

    // snapshot items to avoid closure issues while updating state
    const snapshot = items.slice();

    const uploadSingle = (idx: number) => {
      const it = snapshot[idx];
      setItems((s) => s.map((x, i) => i === idx ? { ...x, status: "uploading", progress: 0 } : x));

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/cms/bulk-upload?single=true");
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const json = JSON.parse(xhr.responseText);
                const r = (json.files && json.files[0]) || json;
                setItems((s) =>
                  s.map((x, i) =>
                    i === idx ? { ...x, status: r?.error ? "error" : "done", progress: 100, error: r?.error ?? null, record: r?.record ?? null } : x
                  )
                );
                resolve();
              } catch (e) {
                setItems((s) => s.map((x, i) => (i === idx ? { ...x, status: "error", progress: 100, error: "invalid server response" } : x)));
                reject(e);
              }
            } else {
              setItems((s) => s.map((x, i) => (i === idx ? { ...x, status: "error", progress: 100, error: `http ${xhr.status}` } : x)));
              reject(new Error(`Upload failed ${xhr.status}`));
            }
          }
        };

        xhr.upload.onprogress = (ev) => {
          const p = ev.lengthComputable ? Math.round((ev.loaded / ev.total) * 100) : 0;
          setItems((s) => s.map((x, i) => (i === idx ? { ...x, progress: p } : x)));
        };

        const form = new FormData();
        form.append("files", it.file);
        form.append("options", JSON.stringify(opts));

        try {
          xhr.send(form);
        } catch (e) {
          setItems((s) => s.map((x, i) => (i === idx ? { ...x, status: "error", progress: 100, error: String(e) } : x)));
          reject(e);
        }
      }).catch(() => {
        // swallow - UI state already set
      });
    };

    // worker pool
    let nextIndex = 0;
    const worker = async () => {
      while (true) {
        const idx = nextIndex++;
        if (idx >= snapshot.length) break;
        // eslint-disable-next-line no-await-in-loop
        await uploadSingle(idx);
      }
    };

    const workers = Array.from({ length: Math.max(1, Math.min(CONCURRENCY, snapshot.length)) }).map(() => worker());
    await Promise.all(workers);

    setUploading(false);
  }, [items, collectionId]);

  const previews = useMemo(() => items.map((it, i) => (
    <div key={i} className="w-28">
      {it.preview ? <img src={it.preview} alt={it.file.name} className="w-28 h-28 object-cover rounded"/> : <div className="w-28 h-28 bg-gray-100"/>}
      <div className="text-xs truncate">{it.file.name}</div>
      <div className="text-xs">{it.progress}% {it.status === 'error' && <span className="text-red-600">({it.error})</span>}</div>
    </div>
  )), [items]);

  return (
    <div className="space-y-3">
      <div
        className="p-4 border-dashed border-2 rounded-lg text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="mb-2">Drag & drop images here or</div>
        <input type="file" multiple accept="image/*" onChange={onSelect} />
      </div>

      {hasFiles && (
        <div>
          <div className="flex gap-2 overflow-x-auto">{previews}</div>

          <div className="flex gap-2 mt-2">
            <button className="btn" onClick={uploadAll} disabled={uploading}>{uploading ? "Uploading..." : "Upload all"}</button>
            <button className="btn-ghost" onClick={clear} disabled={uploading}>Clear</button>
          </div>
        </div>
      )}

      {items.some(i => i.status !== 'pending') && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold">Results</h4>
          <ul className="space-y-1">
            {items.map((it, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0">
                  {it.preview ? <img src={it.preview} className="w-8 h-8 object-cover rounded"/> : null}
                </div>
                <div className="flex-1">
                  <div className="text-sm truncate">{it.file.name}</div>
                  <div className="text-xs text-muted-foreground">{it.status} • {it.progress}%</div>
                </div>
                <div className="w-40 text-right">
                  {it.record ? <a className="text-blue-600 text-sm" href={it.record?.url ?? '#'} target="_blank" rel="noreferrer">View</a> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
