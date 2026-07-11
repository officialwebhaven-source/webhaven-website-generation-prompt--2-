import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Trash2, Edit3, Eye, EyeOff, Search } from "lucide-react";

export default function AdminBlog({ onUpdate }: { onUpdate?: () => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    featured_image: "", category: "", tags: "",
    is_published: false, published_at: "",
  });

  useEffect(() => {
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setPosts(data); });
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openForm = (post?: any) => {
    if (post) {
      setEditing(post);
      setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
        featured_image: post.featured_image, category: post.category, tags: (post.tags || []).join(", "),
        is_published: post.is_published, published_at: post.published_at || "" });
    } else {
      setEditing(null);
      setForm({ title: "", slug: "", excerpt: "", content: "", featured_image: "", category: "", tags: "", is_published: false, published_at: "" });
    }
    setShowForm(true);
  };

  const save = async () => {
    const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const entry = { ...form, tags: tagsArr, published_at: form.is_published ? (form.published_at || new Date().toISOString()) : null };
    if (editing) await supabase.from("blog_posts").update(entry).eq("id", editing.id);
    else await supabase.from("blog_posts").insert(entry);
    setShowForm(false); setEditing(null);
    onUpdate?.();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const remove = async (id: string) => { if (confirm("Delete this post?")) { await supabase.from("blog_posts").delete().eq("id", id); onUpdate?.(); const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); if (data) setPosts(data); } };
  const toggle = async (id: string, val: boolean) => { await supabase.from("blog_posts").update({ is_published: val, published_at: val ? new Date().toISOString() : null }).eq("id", id); onUpdate?.(); const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); if (data) setPosts(data); };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Blog ({posts.length})</h2>
        <button onClick={() => openForm()} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> New Post</button>
      </div>
      <div className="mb-4 flex gap-2"><div className="relative flex-1"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full border border-white/15 bg-transparent py-1.5 pl-7 pr-2 text-sm text-white placeholder-white/30 focus:border-[#c9ff3d] focus:outline-none" /></div></div>

      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5 space-y-3">
          <h3 className="text-sm font-bold">{editing ? "Edit Post" : "New Post"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="URL slug" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt for previews" className="w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Article content (supports HTML)" rows={8} className="w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none font-mono" />
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="Featured image URL" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-[#c9ff3d]" /> Published</label>
            {form.is_published && <input type="datetime-local" value={form.published_at ? form.published_at.slice(0, 16) : ""} onChange={(e) => setForm({ ...form, published_at: new Date(e.target.value).toISOString() })} className="border border-white/15 bg-transparent px-2 py-1 text-xs text-white" />}
          </div>
          <div className="flex gap-2 pt-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Save</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}

      {filtered.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><p className="text-sm text-white/40">No posts yet. Write your first article!</p></div> : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{p.category || "Uncategorized"} · {new Date(p.created_at).toLocaleDateString()} · {p.content.length} chars</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${p.is_published ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>{p.is_published ? "Published" : "Draft"}</span>
                  <button onClick={() => toggle(p.id, !p.is_published)} className="border border-white/15 p-1 hover:border-[#c9ff3d]">{p.is_published ? <Eye size={12} className="text-green-400" /> : <EyeOff size={12} className="text-yellow-400" />}</button>
                  <button onClick={() => openForm(p)} className="border border-white/15 p-1 hover:border-[#c9ff3d]"><Edit3 size={12} className="text-white/40" /></button>
                  <button onClick={() => remove(p.id)} className="border border-white/15 p-1 hover:border-red-500"><Trash2 size={12} className="text-white/30" /></button>
                </div>
              </div>
              {p.excerpt && <p className="mt-2 text-xs text-white/50">{p.excerpt.slice(0, 120)}...</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
