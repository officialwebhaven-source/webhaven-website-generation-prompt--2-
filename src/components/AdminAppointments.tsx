import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, CalendarDays, Clock, CheckCircle, XCircle, Phone, Mail } from "lucide-react";

export default function AdminAppointments() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: "", email: "", phone: "", service: "", date: "", time: "", notes: "", status: "pending" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { supabase.from("appointments").select("*").order("date").order("time").then(({ data }) => { if (data) setItems(data); }); }, []);

  const filtered = items.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search && !a.client_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const save = async () => { await supabase.from("appointments").insert(form); setShowForm(false); setForm({ client_name: "", email: "", phone: "", service: "", date: "", time: "", notes: "", status: "pending" }); const { data } = await supabase.from("appointments").select("*").order("date").order("time"); if (data) setItems(data); };
  const updateStatus = async (id: string, status: string) => { await supabase.from("appointments").update({ status }).eq("id", id); const { data } = await supabase.from("appointments").select("*").order("date").order("time"); if (data) setItems(data); };
  const remove = async (id: string) => { if (confirm("Cancel this appointment?")) { await supabase.from("appointments").delete().eq("id", id); const { data } = await supabase.from("appointments").select("*").order("date").order("time"); if (data) setItems(data); } };

  const statusColor = (s: string) => s === "pending" ? "bg-yellow-500/15 text-yellow-400" : s === "confirmed" ? "bg-green-500/15 text-green-400" : s === "completed" ? "bg-blue-500/15 text-blue-400" : "bg-red-500/15 text-red-400";

  // Group by date
  const grouped: Record<string, any[]> = {};
  filtered.forEach((a) => { const d = a.date; if (!grouped[d]) grouped[d] = []; grouped[d].push(a); });
  const sortedDates = Object.keys(grouped).sort();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Appointments ({filtered.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> Book Meeting</button>
      </div>

      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5">
          <h3 className="text-sm font-bold mb-3">New Appointment</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Client name" required className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Service" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:outline-none"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
          </div>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <div className="mt-3 flex gap-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Book</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client..." className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none w-48" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:outline-none"><option value="all">All</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
      </div>

      {sortedDates.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><CalendarDays size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No appointments scheduled.</p></div> : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
                <CalendarDays size={12} /> {new Date(date + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </h3>
              <div className="space-y-2">
                {grouped[date].map((a) => (
                  <div key={a.id} className="border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold">{a.client_name}</p>
                        <p className="text-xs text-white/40 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock size={10} />{a.time}</span>
                          {a.service && <span>{a.service}</span>}
                          {a.email && <span className="flex items-center gap-1"><Mail size={10} />{a.email}</span>}
                          {a.phone && <span className="flex items-center gap-1"><Phone size={10} />{a.phone}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(a.status)}`}>{a.status}</span>
                        {a.status === "pending" && <button onClick={() => updateStatus(a.id, "confirmed")} className="border border-green-500/30 p-1 hover:bg-green-500/10"><CheckCircle size={12} className="text-green-400" /></button>}
                        <button onClick={() => remove(a.id)} className="border border-white/15 p-1 hover:border-red-500"><XCircle size={12} className="text-white/30" /></button>
                      </div>
                    </div>
                    {a.notes && <p className="mt-2 text-xs text-white/50">{a.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
