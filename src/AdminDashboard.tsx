import { useState, useEffect, useCallback } from "react";
import { signInAdmin, signOutAdmin, getCurrentSession, supabase } from "./lib/supabase";
import { getStats, clearAnalytics } from "./lib/analytics-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from "recharts";
import {
  Eye, Users, Calendar, Mail, FileText, Globe, Smartphone, Monitor,
  LogOut, RefreshCw, Trash2, Lock, ChevronDown,
  ArrowRight, Search, Plus, Edit3, CheckCircle, XCircle,
  Settings, Briefcase, MessageSquare, Tag, CalendarDays, TrendingUp,
  BarChart3, ArrowUpRight, Loader2, Eye as EyeIcon, Star, Image,
  DollarSign, FolderOpen,
} from "lucide-react";
import AdminBlog from "./components/AdminBlog";
import AdminAppointments from "./components/AdminAppointments";
import AdminInvoices from "./components/AdminInvoices";
import AdminFileManager from "./components/AdminFileManager";
import AdminWebsiteProjects from "./components/AdminWebsiteProjects";

const COLORS = ["#c9ff3d", "#7dd3fc", "#fbbf24", "#f87171", "#a78bfa", "#34d399"];

type Tab = "overview" | "enquiries" | "clients" | "quotes" | "projects" | "testimonials" | "services" | "pricing" | "appointments" | "invoices" | "blog" | "web-projects" | "files" | "settings";

// ═════════════════════════════════════════════════════════════════════════════
// AUTH: LOGIN
// ═════════════════════════════════════════════════════════════════════════════

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isSignUp) {
        const { error } = await signInAdmin(email, password).catch(() => ({ error: { message: "Sign up failed" } }));
        if (error) {
          // Try signUp instead
          const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) setError(signUpError.message);
          else if (data.user) { setSuccess("Account created! Check your email to confirm, then sign in."); setIsSignUp(false); }
        } else { onAuth(); }
      } else {
        const { error } = await signInAdmin(email, password);
        if (error) setError(error.message);
        else onAuth();
      }
    } catch { setError("An unexpected error occurred."); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#11120f] px-5">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <a href="/" className="inline-flex items-center gap-3 font-bold text-white tracking-[-0.03em]">
            <span className="grid size-10 place-items-center border border-white/40 text-sm">W</span>
            <span className="text-xl">WebHaven</span>
          </a>
        </div>
        <div className="border border-white/15 bg-white/[0.03] p-8 backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#c9ff3d]/10"><Lock size={18} className="text-[#c9ff3d]" /></span>
            <div>
              <h1 className="text-lg font-bold text-white">{isSignUp ? "Create admin account" : "Admin Dashboard"}</h1>
              <p className="text-sm text-white/50">{isSignUp ? "Set up your admin credentials" : "Sign in to continue"}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required autoFocus
                className="w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-white placeholder-white/35 focus:border-[#c9ff3d] focus:outline-none" />
            </div>
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
                className="w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-white placeholder-white/35 focus:border-[#c9ff3d] focus:outline-none" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-[#c9ff3d]">{success}</p>}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-[#c9ff3d] py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : isSignUp ? "Create Account" : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
            className="mt-4 w-full text-center text-xs text-white/40 underline underline-offset-2 hover:text-white/70">
            {isSignUp ? "Already have an account? Sign in" : "No account? Create one"}
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-white/30">Secured by Supabase Auth.</p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═════════════════════════════════════════════════════════════════════════════

function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`border p-5 transition-colors ${accent ? "border-[#c9ff3d]/30 bg-[#c9ff3d]/5" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
      <div className="flex items-center justify-between">
        <span className={`grid size-10 place-items-center rounded-full ${accent ? "bg-[#c9ff3d]/15" : "bg-white/5"}`}>
          <Icon size={18} className={accent ? "text-[#c9ff3d]" : "text-white/60"} />
        </span>
        {sub && <span className="flex items-center gap-1 text-xs text-[#c9ff3d]"><ArrowUpRight size={12} />{sub}</span>}
      </div>
      <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-1 text-sm text-white/45">{label}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// INLINE EDITABLE INPUT
// ═════════════════════════════════════════════════════════════════════════════

function EditableField({ value, onSave, multiline = false }: { value: string; onSave: (v: string) => void; multiline?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);
  if (editing) {
    return multiline ? (
      <textarea value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => { onSave(val); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { onSave(val); setEditing(false); } }}
        className="w-full border border-[#c9ff3d]/40 bg-transparent px-3 py-2 text-sm text-white focus:outline-none" rows={3} autoFocus />
    ) : (
      <input value={val} onChange={(e) => setVal(e.target.value)} onBlur={() => { onSave(val); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") { onSave(val); setEditing(false); } }}
        className="w-full border border-[#c9ff3d]/40 bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none" autoFocus />
    );
  }
  return <span onClick={() => setEditing(true)} className="cursor-pointer hover:text-[#c9ff3d] transition-colors">{value || "—"}</span>;
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Check auth on mount
  useEffect(() => {
    getCurrentSession().then(s => { if (s) setAuthed(true); });
    supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN") setAuthed(true); if (event === "SIGNED_OUT") setAuthed(false); });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [s, { data: settingsData }] = await Promise.all([
      getStats(),
      supabase.from("settings").select("*"),
    ]);
    setStats(s);
    if (settingsData) setSettings(Object.fromEntries(settingsData.map((x: any) => [x.key, x.value])));
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  const updateSetting = async (key: string, value: string) => {
    await supabase.from("settings").upsert({ key, value });
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#11120f]"><Loader2 size={28} className="animate-spin text-[#c9ff3d]" /></div>;

  const d = stats;
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "enquiries", label: "Enquiries", icon: Mail },
    { key: "clients", label: "Clients", icon: Users },
    { key: "quotes", label: "Quotes", icon: FileText },
    { key: "projects", label: "Portfolio", icon: Image },
    { key: "testimonials", label: "Testimonials", icon: Star },
    { key: "services", label: "Services", icon: Briefcase },
    { key: "pricing", label: "Pricing", icon: Tag },
    { key: "appointments", label: "Bookings", icon: CalendarDays },
    { key: "invoices", label: "Invoices", icon: DollarSign },
    { key: "blog", label: "Blog", icon: MessageSquare },
    { key: "web-projects", label: "Sites", icon: Globe },
    { key: "files", label: "Files", icon: FolderOpen },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#11120f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#11120f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-bold tracking-[-0.03em]"><span className="grid size-7 place-items-center border border-white/40 text-[10px]">W</span><span className="text-sm">WebHaven</span></a>
            <span className="rounded bg-[#c9ff3d]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#c9ff3d]">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="grid size-8 place-items-center border border-white/15 transition-colors hover:border-white/30" title="Refresh"><RefreshCw size={13} /></button>
            <button onClick={() => { signOutAdmin(); setAuthed(false); }} className="flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:border-red-500/50 hover:text-red-400"><LogOut size={12} /> Sign Out</button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="border-b border-white/10 overflow-x-auto">
        <div className="mx-auto flex max-w-[1500px] gap-0 px-4 sm:px-6 min-w-max">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                tab === t.key ? "border-b-2 border-[#c9ff3d] text-[#c9ff3d]" : "text-white/50 hover:text-white/80"
              }`}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        {/* ─── OVERVIEW ───────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              <StatCard label="Total Visitors" value={d?.totalVisitors ?? 0} icon={Eye} accent />
              <StatCard label="Today" value={d?.visitorsToday ?? 0} icon={Users} />
              <StatCard label="This Week" value={d?.visitorsWeek ?? 0} icon={Calendar} />
              <StatCard label="This Month" value={d?.visitorsMonth ?? 0} icon={CalendarDays} />
              <StatCard label="Returning" value={d?.returningCount ?? 0} icon={TrendingUp} />
              <StatCard label="Enquiries" value={d?.totalEnquiries ?? 0} icon={Mail} accent />
              <StatCard label="Pending Quotes" value={d?.pendingQuotes ?? 0} icon={FileText} />
              <StatCard label="Active Clients" value={d?.activeClients ?? 0} icon={Briefcase} />
            </div>

            {/* Charts */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.02] p-5 lg:col-span-2">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50">Visitors — Last 14 Days</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={d?.dailyVisitors ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1a1b19", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 0, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.7)" }} itemStyle={{ color: "#c9ff3d" }} />
                    <Area type="monotone" dataKey="visitors" stroke="#c9ff3d" strokeWidth={2} fill="rgba(201,255,61,0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50">Revenue (12 months)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={d?.monthlyRevenue ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v > 0 ? `R${v}` : ""} />
                    <Tooltip contentStyle={{ background: "#1a1b19", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 0, fontSize: 12 }} formatter={(v) => [`R${v}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#c9ff3d" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50">Traffic Sources</h3>
                {d?.trafficSources?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={d.trafficSources} layout="vertical">
                      <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="source" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ background: "#1a1b19", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 0, fontSize: 11 }} />
                      <Bar dataKey="count" fill="#c9ff3d" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-xs text-white/30">No data</p>}
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/50">Top Pages</h3>
                <div className="space-y-2">{d?.topPages?.map((p: any, i: number) => (
                  <div key={p.page} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><span className="text-xs text-white/30 w-4">{i + 1}</span><span className="capitalize">{p.page}</span></div>
                    <div className="flex items-center gap-2"><div className="h-1 w-16 rounded-full bg-[#c9ff3d]/40"><div className="h-1 rounded-full bg-[#c9ff3d]" style={{ width: `${Math.min(100, (p.count / (d.topPages[0]?.count || 1)) * 100)}%` }} /></div><span className="text-xs text-white/40 w-6 text-right">{p.count}</span></div>
                  </div>
                ))}{d?.topPages?.length === 0 && <p className="text-xs text-white/30">No data</p>}</div>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50"><Globe size={12} /> Regions</h3>
                <div className="space-y-2">{d?.countries?.map((c: any, i: number) => (
                  <div key={c.country} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><span className="size-1.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /><span>{c.country}</span></div>
                    <span className="text-xs text-white/40">{c.count}</span>
                  </div>
                ))}{d?.countries?.length === 0 && <p className="text-xs text-white/30">No data</p>}</div>
                <div className="mt-4 pt-3 border-t border-white/10 flex gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5"><Smartphone size={11} className="text-[#c9ff3d]" /> Mobile: {d?.mobileCount ?? 0}</span>
                  <span className="flex items-center gap-1.5"><Monitor size={11} className="text-[#7dd3fc]" /> Desktop: {d?.desktopCount ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
              <button onClick={async () => { await clearAnalytics(); fetchData(); }} className="flex items-center gap-1.5 border border-red-500/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:border-red-500 hover:bg-red-500/10"><Trash2 size={12} /> Clear Data</button>
              <p className="ml-auto text-[10px] text-white/20">Powered by Supabase</p>
            </div>
          </>
        )}

        {/* ─── ENQUIRIES ──────────────────────────────────────────────────── */}
        {tab === "enquiries" && <EnquiriesTab data={d} onUpdate={fetchData} />}

        {/* ─── CLIENTS ────────────────────────────────────────────────────── */}
        {tab === "clients" && <ClientsTab data={d} onUpdate={fetchData} />}

        {/* ─── QUOTES ─────────────────────────────────────────────────────── */}
        {tab === "quotes" && <QuotesTab data={d} onUpdate={fetchData} />}

        {/* ─── PROJECTS ───────────────────────────────────────────────────── */}
        {tab === "projects" && <ProjectsTab onUpdate={fetchData} />}

        {/* ─── TESTIMONIALS ───────────────────────────────────────────────── */}
        {tab === "testimonials" && <TestimonialsTab onUpdate={fetchData} />}

        {/* ─── SERVICES ───────────────────────────────────────────────────── */}
        {tab === "services" && <ServicesTab onUpdate={fetchData} />}

        {/* ─── PRICING ────────────────────────────────────────────────────── */}
        {tab === "pricing" && <PricingTab onUpdate={fetchData} />}

        {/* ─── SETTINGS ───────────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-bold mb-6">Site Settings</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/35">{key.replace(/_/g, " ")}</label>
                  <div className="mt-1 text-sm text-white"><EditableField value={value} onSave={(v) => updateSetting(key, v)} multiline={key.includes("description") || key.includes("headline")} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── APPOINTMENTS ──────────────────────────────────────────────── */}
        {tab === "appointments" && <AdminAppointments />}

        {/* ─── INVOICES ──────────────────────────────────────────────────── */}
        {tab === "invoices" && <AdminInvoices />}

        {/* ─── BLOG ──────────────────────────────────────────────────────── */}
        {tab === "blog" && <AdminBlog onUpdate={() => {}} />}

        {/* ─── WEBSITE PROJECTS ──────────────────────────────────────────── */}
        {tab === "web-projects" && <AdminWebsiteProjects />}

        {/* ─── FILE MANAGER ─────────────────────────────────────────────── */}
        {tab === "files" && <AdminFileManager />}
      </div>

      <footer className="mt-12 border-t border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between"><p className="text-[10px] text-white/20">WebHaven Admin</p><a href="/" className="text-[10px] text-white/20 hover:text-white/50">← Back to site</a></div>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function EnquiriesTab({ data, onUpdate }: { data: any; onUpdate: () => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const enquiries = (data?.enquiries ?? []).filter((e: any) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const markRead = async (id: string) => {
    await supabase.from("enquiries").update({ is_read: true, status: "read" }).eq("id", id);
    onUpdate();
  };
  const archiveEnquiry = async (id: string) => {
    await supabase.from("enquiries").update({ status: "archived" }).eq("id", id);
    onUpdate();
  };
  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("enquiries").delete().eq("id", id);
    onUpdate();
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold">Enquiries ({enquiries.length})</h2>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-48 border border-white/15 bg-transparent py-1.5 pl-8 pr-3 text-sm text-white placeholder-white/30 focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-white/15 bg-transparent py-1.5 px-3 text-sm text-white focus:outline-none">
            <option value="all">All</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option>
          </select>
        </div>
      </div>
      {enquiries.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><Mail size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No enquiries found.</p></div> : (
        <div className="space-y-2">{enquiries.map((e: any) => {
          const isOpen = expanded === e.id;
          return (
            <div key={e.id} className={`border ${!e.is_read ? "border-[#c9ff3d]/30 bg-[#c9ff3d]/5" : "border-white/10 bg-white/[0.02]"}`}>
              <button onClick={() => { setExpanded(isOpen ? null : e.id); if (!e.is_read) markRead(e.id); }} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                <span className={`size-2 rounded-full ${e.status === "new" ? "bg-[#c9ff3d]" : e.status === "archived" ? "bg-gray-500" : "bg-blue-400"}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{e.name}</p><p className="truncate text-xs text-white/40">{e.business} · {e.email || "No email"}</p></div>
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${e.status === "new" ? "bg-[#c9ff3d]/15 text-[#c9ff3d]" : "bg-white/5 text-white/40"}`}>{e.status}</span>
                <span className="hidden text-[10px] text-white/30 sm:block">{new Date(e.created_at).toLocaleDateString()}</span>
                <ChevronDown size={14} className={`shrink-0 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-4 py-3">
                  <div className="grid gap-3 sm:grid-cols-3 text-xs"><div><span className="text-white/30">Phone</span><p>{e.phone || "—"}</p></div><div><span className="text-white/30">Budget</span><p>{e.budget || "—"}</p></div><div><span className="text-white/30">Date</span><p>{new Date(e.created_at).toLocaleString()}</p></div></div>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{e.message}</p>
                  <div className="mt-3 flex gap-2">
                    {e.email && <a href={`mailto:${e.email}`} className="flex items-center gap-1 border border-white/15 px-2 py-1 text-[10px] font-bold uppercase hover:border-[#c9ff3d] hover:text-[#c9ff3d]"><Mail size={10} /> Reply</a>}
                    {e.phone && <a href={`https://wa.me/${e.phone.replace(/\s/g, "").replace(/^0/, "27")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 border border-white/15 px-2 py-1 text-[10px] font-bold uppercase hover:border-[#c9ff3d] hover:text-[#c9ff3d]"><MessageSquare size={10} /> WhatsApp</a>}
                    <button onClick={() => archiveEnquiry(e.id)} className="flex items-center gap-1 border border-white/15 px-2 py-1 text-[10px] font-bold uppercase hover:border-yellow-500/50 hover:text-yellow-400"><CheckCircle size={10} /> Archive</button>
                    <button onClick={() => deleteEnquiry(e.id)} className="flex items-center gap-1 border border-white/15 px-2 py-1 text-[10px] font-bold uppercase hover:border-red-500/50 hover:text-red-400"><XCircle size={10} /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}</div>
      )}
    </>
  );
}

function ClientsTab({ data, onUpdate }: { data: any; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", website: "", industry: "", status: "lead", package: "", budget: "", notes: "" });

  const clients = (data?.clients ?? []).filter((c: any) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openForm = (client?: any) => {
    if (client) { setEditing(client); setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, website: client.website, industry: client.industry, status: client.status, package: client.package, budget: client.budget, notes: client.notes }); }
    else { setEditing(null); setForm({ name: "", company: "", email: "", phone: "", website: "", industry: "", status: "lead", package: "", budget: "", notes: "" }); }
    setShowForm(true);
  };

  const save = async () => {
    if (editing) await supabase.from("clients").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing.id);
    else await supabase.from("clients").insert(form);
    setShowForm(false); onUpdate();
  };

  const deleteClient = async (id: string) => { if (confirm("Delete this client?")) { await supabase.from("clients").delete().eq("id", id); onUpdate(); } };

  const statusColor = (s: string) => s === "active" ? "bg-green-500/15 text-green-400" : s === "lead" ? "bg-[#c9ff3d]/15 text-[#c9ff3d]" : s === "completed" ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-white/40";

  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Clients ({clients.length})</h2><div className="flex gap-2"><div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-44 border border-white/15 bg-transparent py-1.5 pl-7 pr-2 text-sm text-white placeholder-white/30 focus:border-[#c9ff3d] focus:outline-none" /></div><button onClick={() => openForm()} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> Add Client</button></div></div>

      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5">
          <h3 className="text-sm font-bold mb-4">{editing ? "Edit Client" : "New Client"}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["name", "company", "email", "phone", "website", "industry", "budget", "package"] as const).map(field => (
              <div key={field}><label className="text-[9px] font-bold uppercase tracking-wider text-white/35">{field}</label><input value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" /></div>
            ))}
            <div><label className="text-[9px] font-bold uppercase tracking-wider text-white/35">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:outline-none"><option value="lead">Lead</option><option value="active">Active</option><option value="completed">Completed</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div className="mt-3"><label className="text-[9px] font-bold uppercase tracking-wider text-white/35">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" /></div>
          <div className="mt-3 flex gap-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Save</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}

      {clients.length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><Users size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No clients yet.</p></div> : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-wider text-white/35"><th className="px-4 py-3">Name</th><th className="px-4 py-3 hidden sm:table-cell">Company</th><th className="px-4 py-3 hidden md:table-cell">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>{clients.map((c: any) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-white/60">{c.company || "—"}</td>
                <td className="px-4 py-3 hidden md:table-cell text-white/60">{c.email || "—"}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(c.status)}`}>{c.status}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1.5"><button onClick={() => openForm(c)} className="border border-white/15 p-1 hover:border-[#c9ff3d] hover:text-[#c9ff3d]"><Edit3 size={12} /></button><button onClick={() => deleteClient(c.id)} className="border border-white/15 p-1 hover:border-red-500 hover:text-red-400"><XCircle size={12} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

function QuotesTab({ data, onUpdate }: { data: any; onUpdate: () => void }) {
  const updateStatus = async (id: string, status: string) => { await supabase.from("quotes").update({ status, updated_at: new Date().toISOString() }).eq("id", id); onUpdate(); };
  const deleteQuote = async (id: string) => { if (confirm("Delete?")) { await supabase.from("quotes").delete().eq("id", id); onUpdate(); } };
  const convertToClient = async (q: any) => {
    await supabase.from("clients").insert({ name: q.name, company: q.business, email: q.email, phone: q.phone, industry: q.industry, status: "active", budget: q.budget, notes: q.message });
    await supabase.from("quotes").update({ status: "converted", is_converted: true, updated_at: new Date().toISOString() }).eq("id", q.id);
    onUpdate();
  };
  const statusColor = (s: string) => s === "pending" ? "bg-yellow-500/15 text-yellow-400" : s === "accepted" ? "bg-green-500/15 text-green-400" : s === "rejected" ? "bg-red-500/15 text-red-400" : s === "converted" ? "bg-[#c9ff3d]/15 text-[#c9ff3d]" : "bg-white/5 text-white/40";

  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Quotes ({(data?.quotes ?? []).length})</h2></div>
      {(data?.quotes ?? []).length === 0 ? <div className="border border-white/10 bg-white/[0.02] p-16 text-center"><FileText size={32} className="mx-auto text-white/20" /><p className="mt-4 text-sm text-white/40">No quotes yet.</p></div> : (
        <div className="space-y-2">{(data?.quotes ?? []).map((q: any) => (
          <div key={q.id} className="border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between"><div><p className="font-semibold">{q.name}</p><p className="text-xs text-white/40">{q.business} · {q.email || "No email"}</p></div><span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(q.status)}`}>{q.status}</span></div>
            {q.message && <p className="mt-2 text-sm text-white/60">{q.message}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {q.status === "pending" && <><button onClick={() => updateStatus(q.id, "accepted")} className="border border-green-500/30 px-2 py-1 text-[10px] font-bold uppercase text-green-400 hover:bg-green-500/10"><CheckCircle size={10} className="inline mr-1" />Accept</button><button onClick={() => updateStatus(q.id, "rejected")} className="border border-red-500/30 px-2 py-1 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/10"><XCircle size={10} className="inline mr-1" />Reject</button><button onClick={() => convertToClient(q)} className="border border-[#c9ff3d]/30 px-2 py-1 text-[10px] font-bold uppercase text-[#c9ff3d] hover:bg-[#c9ff3d]/10">Convert to Client</button></>}
              <button onClick={() => deleteQuote(q.id)} className="border border-white/15 px-2 py-1 text-[10px] font-bold uppercase text-white/40 hover:border-red-500 hover:text-red-400"><XCircle size={10} className="inline mr-1" />Delete</button>
            </div>
          </div>
        ))}</div>
      )}
    </>
  );
}

function ProjectsTab({ onUpdate }: { onUpdate: () => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Website", description: "", result: "", image_url: "", url: "", technologies: "", is_featured: false, is_published: true, sort_order: 0 });

  useEffect(() => { supabase.from("projects").select("*").order("sort_order").then(({ data }) => { if (data) setProjects(data); }); }, []);

  const save = async () => {
    const techArr = form.technologies.split(",").map(t => t.trim()).filter(Boolean);
    const entry = { ...form, technologies: techArr };
    await supabase.from("projects").insert(entry);
    setShowForm(false); setForm({ title: "", type: "Website", description: "", result: "", image_url: "", url: "", technologies: "", is_featured: false, is_published: true, sort_order: 0 });
    onUpdate(); supabase.from("projects").select("*").order("sort_order").then(({ data }) => { if (data) setProjects(data); });
  };

  const toggle = async (id: string, field: string, val: boolean) => { await supabase.from("projects").update({ [field]: val }).eq("id", id); onUpdate(); supabase.from("projects").select("*").order("sort_order").then(({ data }) => { if (data) setProjects(data); }); };
  const remove = async (id: string) => { if (confirm("Delete?")) { await supabase.from("projects").delete().eq("id", id); onUpdate(); supabase.from("projects").select("*").order("sort_order").then(({ data }) => { if (data) setProjects(data); }); } };

  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Portfolio ({projects.length})</h2><button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> Add Project</button></div>
      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5">
          <h3 className="text-sm font-bold mb-3">New Project</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type (e.g. Website)" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <textarea value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} placeholder="Result" rows={2} className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Project URL" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Technologies (comma separated)" className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <div className="mt-3 flex gap-3"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#c9ff3d]" /> Featured</label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-[#c9ff3d]" /> Published</label></div>
          <div className="mt-3 flex gap-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Save</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}
      <div className="space-y-2">{projects.map((p: any) => (
        <div key={p.id} className="border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
          <div><p className="font-semibold">{p.title}</p><p className="text-xs text-white/40">{p.type} · {p.description.slice(0, 80)}...</p><div className="mt-1 flex gap-2"><span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${p.is_featured ? "bg-[#c9ff3d]/15 text-[#c9ff3d]" : "bg-white/5 text-white/30"}`}>{p.is_featured ? "Featured" : ""}</span><span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${p.is_published ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"}`}>{p.is_published ? "Published" : "Draft"}</span></div></div>
          <div className="flex gap-1.5"><button onClick={() => toggle(p.id, "is_featured", !p.is_featured)} className="border border-white/15 p-1 hover:border-[#c9ff3d]"><Star size={12} className={p.is_featured ? "text-[#c9ff3d]" : "text-white/30"} /></button><button onClick={() => toggle(p.id, "is_published", !p.is_published)} className="border border-white/15 p-1 hover:border-green-500"><EyeIcon size={12} className={p.is_published ? "text-green-400" : "text-white/30"} /></button><button onClick={() => remove(p.id)} className="border border-white/15 p-1 hover:border-red-500"><XCircle size={12} className="text-white/30" /></button></div>
        </div>
      ))}</div>
    </>
  );
}

function TestimonialsTab({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", role: "", text: "", rating: 5, photo_url: "", is_featured: false, is_published: false, sort_order: 0 });

  useEffect(() => { supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); }, []);

  const save = async () => { await supabase.from("testimonials").insert(form); setShowForm(false); setForm({ name: "", company: "", role: "", text: "", rating: 5, photo_url: "", is_featured: false, is_published: false, sort_order: 0 }); onUpdate(); supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); };
  const remove = async (id: string) => { if (confirm("Delete?")) { await supabase.from("testimonials").delete().eq("id", id); onUpdate(); supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); } };
  const toggle = async (id: string, field: string, val: boolean) => { await supabase.from("testimonials").update({ [field]: val }).eq("id", id); onUpdate(); supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); };

  return (
    <>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Testimonials ({items.length})</h2><button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Plus size={13} /> Add</button></div>
      {showForm && (
        <div className="mb-4 border border-[#c9ff3d]/30 bg-[#c9ff3d]/5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Testimonial text" rows={3} className="mt-3 w-full border border-white/15 bg-transparent px-2 py-1.5 text-sm text-white focus:border-[#c9ff3d] focus:outline-none" />
          <div className="mt-3 flex items-center gap-3"><span className="text-xs text-white/50">Rating:</span>{[1,2,3,4,5].map(s => <button key={s} onClick={() => setForm({ ...form, rating: s })}><Star size={16} className={s <= form.rating ? "text-[#c9ff3d]" : "text-white/20"} /></button>)}</div>
          <div className="mt-2 flex gap-3"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#c9ff3d]" /> Featured</label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-[#c9ff3d]" /> Publish</label></div>
          <div className="mt-3 flex gap-2"><button onClick={save} className="bg-[#c9ff3d] px-4 py-1.5 text-xs font-bold text-black">Save</button><button onClick={() => setShowForm(false)} className="border border-white/15 px-4 py-1.5 text-xs text-white/60">Cancel</button></div>
        </div>
      )}
      <div className="space-y-2">{items.map((t: any) => (
        <div key={t.id} className="border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
          <div><p className="font-semibold">{t.name} <span className="text-white/40 font-normal">· {t.company}</span></p><p className="text-xs text-white/50 mt-1">"{t.text.slice(0, 100)}..."</p><div className="mt-1 flex gap-2">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={10} className="text-[#c9ff3d]" fill="#c9ff3d" />)}<span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${t.is_published ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"}`}>{t.is_published ? "Published" : "Pending"}</span></div></div>
          <div className="flex gap-1.5"><button onClick={() => toggle(t.id, "is_published", !t.is_published)} className="border border-white/15 p-1 hover:border-green-500"><CheckCircle size={12} className={t.is_published ? "text-green-400" : "text-white/30"} /></button><button onClick={() => remove(t.id)} className="border border-white/15 p-1 hover:border-red-500"><XCircle size={12} className="text-white/30" /></button></div>
        </div>
      ))}</div>
    </>
  );
}

function ServicesTab({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { supabase.from("services").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); }, []);
  const update = async (id: string, field: string, val: any) => { await supabase.from("services").update({ [field]: val }).eq("id", id); onUpdate(); supabase.from("services").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); };
  const remove = async (id: string) => { if (confirm("Delete?")) { await supabase.from("services").delete().eq("id", id); onUpdate(); supabase.from("services").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); } };
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Services</h2>
      <div className="space-y-2">{items.map((s: any) => (
        <div key={s.id} className="border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between"><input value={s.title} onChange={(e) => update(s.id, "title", e.target.value)} className="bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-transparent focus:border-[#c9ff3d]" /><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={s.is_active} onChange={(e) => update(s.id, "is_active", e.target.checked)} className="accent-[#c9ff3d]" /> Active</label><button onClick={() => remove(s.id)} className="border border-white/15 p-1 hover:border-red-500"><XCircle size={12} className="text-white/30" /></button></div>
          <textarea value={s.description} onChange={(e) => update(s.id, "description", e.target.value)} rows={2} className="mt-2 w-full bg-transparent text-sm text-white/60 focus:outline-none border-b border-transparent focus:border-[#c9ff3d]" />
        </div>
      ))}</div>
    </>
  );
}

function PricingTab({ onUpdate }: { onUpdate: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { supabase.from("pricing_packages").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); }, []);
  const update = async (id: string, field: string, val: any) => { await supabase.from("pricing_packages").update({ [field]: val }).eq("id", id); onUpdate(); supabase.from("pricing_packages").select("*").order("sort_order").then(({ data }) => { if (data) setItems(data); }); };
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Pricing Packages</h2>
      <div className="space-y-2">{items.map((p: any) => (
        <div key={p.id} className="border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <input value={p.name} onChange={(e) => update(p.id, "name", e.target.value)} className="bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-transparent focus:border-[#c9ff3d] w-32" />
            <input value={p.price} onChange={(e) => update(p.id, "price", e.target.value)} className="bg-transparent text-sm text-[#c9ff3d] focus:outline-none border-b border-transparent focus:border-[#c9ff3d] w-32" />
            <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={p.is_popular} onChange={(e) => update(p.id, "is_popular", e.target.checked)} className="accent-[#c9ff3d]" /> Popular</label>
            <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={p.is_active} onChange={(e) => update(p.id, "is_active", e.target.checked)} className="accent-[#c9ff3d]" /> Active</label>
          </div>
          <textarea value={p.description} onChange={(e) => update(p.id, "description", e.target.value)} rows={1} className="mt-2 w-full bg-transparent text-xs text-white/50 focus:outline-none" />
        </div>
      ))}</div>
    </>
  );
}
