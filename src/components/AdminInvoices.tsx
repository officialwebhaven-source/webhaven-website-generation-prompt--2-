import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Download, Send, CheckCircle, Trash2, FileText } from "lucide-react";

interface InvoiceItem { description: string; qty: number; rate: number }

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_id: "", client_name: "", client_email: "", items: [{ description: "", qty: 1, rate: 0 } as InvoiceItem], notes: "", due_date: "", status: "draft", invoice_number: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("invoices").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setInvoices(data); });
    supabase.from("clients").select("id, name, company, email").order("name").then(({ data }) => { if (data) setClients(data); });
  }, []);

  const filtered = invoices.filter((i) => i.invoice_number.toLowerCase().includes(search.toLowerCase()) || i.client_name.toLowerCase().includes(search.toLowerCase()));

  const selectClient = (clientId: string) => {
    const c = clients.find((x) => x.id === clientId);
    if (c) setForm({ ...form, client_id: c.id, client_name: c.name + (c.company ? ` (${c.company})` : ""), client_email: c.email });
  };

  const genInvoiceNum = () => `INV-${new Date().getFullYear()}-${String((invoices.length + 1)).padStart(3, "0")}`;

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", qty: 1, rate: 0 }] });
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, field: keyof InvoiceItem, val: string | number) => {
    const items = [...form.items]; items[idx] = { ...items[idx], [field]: val }; setForm({ ...form, items });
  };

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const save = async () => {
    const entry = { ...form, invoice_number: form.invoice_number || genInvoiceNum(), subtotal, vat, total, due_date: form.due_date || null, items: form.items };
    await supabase.from("invoices").insert(entry);
    setShowForm(false); setForm({ client_id: "", client_name: "", client_email: "", items: [{ description: "", qty: 1, rate: 0 }], notes: "", due_date: "", status: "draft", invoice_number: "" });
    const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false }); if (data) setInvoices(data);
  };

  const updateStatus = async (id: string, status: string) => { await supabase.from("invoices").update({ status }).eq("id", id); const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false }); if (data) setInvoices(data); };
  const remove = async (id: string) => { if (confirm("Delete this invoice?")) { await supabase.from("invoices").delete().eq("id", id); const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false }); if (data) setInvoices(data); } };

  const statusColor = (s: string) => s === "paid" ? "bg-green-500/15 text-green-400" : s === "sent" ? "bg-blue-500/15 text-blue-400" : s === "overdue" ? "bg-red-500/15 text-red-400" : s === "draft" ? "bg-white/5 text-white/40" : "bg-white/5 text-white/30";

  const printInvoice = (inv: any) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${inv.invoice_number}</title><style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#111}h1{margin:0}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}th{font-size:12px;text-transform:uppercase;color:#666}.total{text-align:right;font-size:24px;font-weight:bold;margin-top:20px}.badge{display:inline-block;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:bold}</style></head><body><h1>WebHaven</h1><p style="color:#666">Building websites that grow businesses</p><hr><div style="display:flex;justify-content:space-between;margin:20px 0"><div><strong>${inv.client_name}</strong>${inv.client_email ? `<br>${inv.client_email}` : ""}</div><div style="text-align:right"><strong>${inv.invoice_number}</strong><br>Date: ${new Date(inv.created_at).toLocaleDateString()}${inv.due_date ? `<br>Due: ${new Date(inv.due_date).toLocaleDateString()}` : ""}</div></div><table><tr><th>Description</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr>${inv.items.map((item: InvoiceItem) => `<tr><td>${item.description}</td><td>${item.qty}</td><td>R${item.rate.toFixed(2)}</td><td style="text-align:right">R${(item.qty * item.rate).toFixed(2)}</td></tr>`).join("")}</table><div class="total"><div style="font-size:14px;color:#666">Subtotal: R${inv.subtotal.toFixed(2)}</div><div style="font-size:14px;color:#666">VAT (15%): R${inv.vat.toFixed(2)}</div><div style="color:#c9ff3d">Total: R${inv.total.toFixed(2)}</div></div>${inv.notes ? `<p style="margin-top:40px;color:#666;font-size:14px"><strong>Notes:</strong> ${inv.notes}</p>` : ""}<script>window.print()<\/script></body></html>`);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Invoices ({invoices.length})</h2>
        <button onClick={() => { setForm({ ...form, invoice_number: genInvoiceNum() }); setShowForm(!showForm); }} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> New Invoice</button>
      </div>

      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5 space-y-3">
          <h3 className="text-sm font-bold">New Invoice — {form.invoice_number}</h3>
          <select value={form.client_id} onChange={(e) => selectClient(e.target.value)} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none w-full">
            <option value="">Select client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Client name" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} placeholder="Client email" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1">Line Items</p>
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Description" className="flex-1 border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
                <input type="number" value={item.qty} onChange={(e) => updateItem(i, "qty", parseInt(e.target.value) || 0)} placeholder="Qty" className="w-16 border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none text-center" />
                <input type="number" value={item.rate} onChange={(e) => updateItem(i, "rate", parseFloat(e.target.value) || 0)} placeholder="Rate" className="w-24 border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none text-right" />
                <span className="text-xs text-white/50 w-20 text-right">R{((item.qty * item.rate)).toFixed(2)}</span>
                {form.items.length > 1 && <button onClick={() => removeItem(i)} className="text-white/30 hover:text-red-400"><Trash2 size={12} /></button>}
              </div>
            ))}
            <button onClick={addItem} className="text-xs text-[#c9ff3d] font-bold mt-1">+ Add item</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Subtotal</p><p className="text-sm text-white">R{subtotal.toFixed(2)}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-wider text-white/35">VAT (15%)</p><p className="text-sm text-white">R{vat.toFixed(2)}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Total</p><p className="text-lg font-bold text-[#c9ff3d]">R{total.toFixed(2)}</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" placeholder="Due date" />
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <div className="flex gap-2 pt-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Create Invoice</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}

      <div className="mb-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none w-64" /></div>

      {filtered.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><FileText size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No invoices yet.</p></div> : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-wider text-white/35"><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Client</th><th className="px-4 py-3 hidden sm:table-cell">Date</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>{filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs">{inv.invoice_number}</td>
                <td className="px-4 py-3">{inv.client_name}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-white/40 text-xs">{new Date(inv.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-[#c9ff3d]">R{inv.total.toFixed(2)}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(inv.status)}`}>{inv.status}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1.5">
                  <button onClick={() => printInvoice(inv)} className="border border-white/15 p-1 hover:border-[#c9ff3d]" title="Print/PDF"><Download size={12} className="text-white/40" /></button>
                  {inv.status === "draft" && <button onClick={() => updateStatus(inv.id, "sent")} className="border border-white/15 p-1 hover:border-blue-500" title="Send"><Send size={12} className="text-blue-400" /></button>}
                  {inv.status !== "paid" && <button onClick={() => updateStatus(inv.id, "paid")} className="border border-white/15 p-1 hover:border-green-500" title="Mark paid"><CheckCircle size={12} className="text-green-400" /></button>}
                  <button onClick={() => remove(inv.id)} className="border border-white/15 p-1 hover:border-red-500" title="Delete"><Trash2 size={12} className="text-white/30" /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
