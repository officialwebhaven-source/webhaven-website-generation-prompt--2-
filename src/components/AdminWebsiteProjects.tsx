import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Trash2, Edit3, Globe, Server, Calendar, DollarSign } from "lucide-react";

export default function AdminWebsiteProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    client_name: "", domain: "", hosting_provider: "",
    status: "in_progress", renewal_date: "", monthly_cost: "",
    cms: "", notes: "",
  });

  useEffect(() => {
    supabase.from("website_projects").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => { if (error) { setProjects([]); return; } if (data) setProjects(data); });
  }, []);

  const openForm = (p?: any) => {
    if (p) { setEditing(p); setForm({ client_name: p.client_name, domain: p.domain, hosting_provider: p.hosting_provider, status: p.status, renewal_date: p.renewal_date || "", monthly_cost: p.monthly_cost || "", cms: p.cms || "", notes: p.notes || "" }); }
    else { setEditing(null); setForm({ client_name: "", domain: "", hosting_provider: "", status: "in_progress", renewal_date: "", monthly_cost: "", cms: "", notes: "" }); }
    setShowForm(true);
  };

  const save = async () => {
    if (editing) await supabase.from("website_projects").update(form).eq("id", editing.id);
    else await supabase.from("website_projects").insert(form);
    setShowForm(false);
    const { data } = await supabase.from("website_projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const remove = async (id: string) => { if (confirm("Delete this project?")) { await supabase.from("website_projects").delete().eq("id", id); const { data } = await supabase.from("website_projects").select("*").order("created_at", { ascending: false }); if (data) setProjects(data); } };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { planning: "bg-blue-500/15 text-blue-400", in_progress: "bg-yellow-500/15 text-yellow-400", completed: "bg-green-500/15 text-green-400", maintenance: "bg-[#c9ff3d]/15 text-[#c9ff3d]", paused: "bg-white/5 text-white/40" };
    return map[s] || "bg-white/5 text-white/30";
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Website Projects ({projects.length})</h2>
        <button onClick={() => openForm()} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> Add Project</button>
      </div>

      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5">
          <h3 className="text-sm font-bold mb-3">{editing ? "Edit Project" : "New Website Project"}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Client name" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Domain (e.g. client.co.za)" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.hosting_provider} onChange={(e) => setForm({ ...form, hosting_provider: e.target.value })} placeholder="Hosting provider" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:outline-none"><option value="planning">Planning</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="maintenance">Maintenance</option><option value="paused">Paused</option></select>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input type="date" value={form.renewal_date} onChange={(e) => setForm({ ...form, renewal_date: e.target.value })} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.monthly_cost} onChange={(e) => setForm({ ...form, monthly_cost: e.target.value })} placeholder="Monthly cost (R)" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.cms} onChange={(e) => setForm({ ...form, cms: e.target.value })} placeholder="CMS (e.g. WordPress)" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <div className="mt-3 flex gap-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Save</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}

      {projects.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><Globe size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No website projects tracked yet.</p></div> : (
        <div className="space-y-2">
          {projects.map((p: any) => (
            <div key={p.id} className="border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{p.client_name}</p>
                  <div className="text-xs text-white/40 mt-1 flex items-center gap-3 flex-wrap">
                    {p.domain && <span className="flex items-center gap-1"><Globe size={10} />{p.domain}</span>}
                    {p.hosting_provider && <span className="flex items-center gap-1"><Server size={10} />{p.hosting_provider}</span>}
                    {p.cms && <span>{p.cms}</span>}
                    {p.monthly_cost && <span className="flex items-center gap-1"><DollarSign size={10} />{p.monthly_cost}/mo</span>}
                    {p.renewal_date && <span className="flex items-center gap-1"><Calendar size={10} />Renews {new Date(p.renewal_date + "T00:00:00").toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(p.status)}`}>{p.status.replace("_", " ")}</span>
                  <button onClick={() => openForm(p)} className="border border-white/15 p-1 hover:border-[#c9ff3d]"><Edit3 size={12} className="text-white/40" /></button>
                  <button onClick={() => remove(p.id)} className="border border-white/15 p-1 hover:border-red-500"><Trash2 size={12} className="text-white/30" /></button>
                </div>
              </div>
              {p.notes && <p className="mt-2 text-xs text-white/50">{p.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
