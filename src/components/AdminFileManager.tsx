import { useState, useEffect } from "react";
import { Upload, File, Image, FileText, Trash2, ExternalLink, FolderOpen } from "lucide-react";

export default function AdminFileManager() {
  const [files] = useState<{ name: string; size: number; type: string; uploaded_at: string; url?: string }[]>([]);
  const [storageReady] = useState(false);

  useEffect(() => {
    // Storage requires manual setup in Supabase dashboard
  }, []);

  return (
    <>
      <h2 className="text-lg font-bold mb-4">File Manager</h2>

      {!storageReady ? (
        <div className="border border-white/10 bg-white/[0.02] p-10 text-center">
          <FolderOpen size={40} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-white">Storage Not Configured</h3>
          <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
            To enable file uploads, create a "files" bucket in your Supabase Storage:
          </p>
          <ol className="mt-4 text-sm text-white/60 max-w-sm mx-auto text-left space-y-2">
            <li className="flex items-start gap-2"><span className="text-[#c9ff3d] font-bold mt-0.5">1.</span> Go to Supabase Dashboard → Storage</li>
            <li className="flex items-start gap-2"><span className="text-[#c9ff3d] font-bold mt-0.5">2.</span> Create a bucket named "files"</li>
            <li className="flex items-start gap-2"><span className="text-[#c9ff3d] font-bold mt-0.5">3.</span> Set bucket policy to allow authenticated uploads</li>
          </ol>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-white/15 p-8 text-center hover:border-[#c9ff3d]/30 transition-colors">
            <Upload size={28} className="mx-auto text-white/30 mb-3" />
            <p className="text-sm text-white/50">Drag & drop files here, or click to upload</p>
            <p className="text-xs text-white/30 mt-1">Images, PDFs, documents — max 10MB</p>
          </div>

          {files.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((f, i) => (
                <div key={i} className="border border-white/10 bg-white/[0.02] p-3 flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded bg-white/5">
                    {f.type.startsWith("image") ? <Image size={14} className="text-[#c9ff3d]" /> : f.type.includes("pdf") ? <FileText size={14} className="text-red-400" /> : <File size={14} className="text-blue-400" />}
                  </span>
                  <div className="min-w-0 flex-1"><p className="text-sm truncate">{f.name}</p><p className="text-[10px] text-white/30">{(f.size / 1024).toFixed(1)} KB</p></div>
                  <button className="text-white/30 hover:text-white"><ExternalLink size={12} /></button>
                  <button className="text-white/30 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
