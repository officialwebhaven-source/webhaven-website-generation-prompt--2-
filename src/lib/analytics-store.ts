import { supabase } from "./supabase";
import type { VisitRow, EnquiryRow } from "./supabase";

/** Track a page visit — fire-and-forget */
export function trackPageVisit() {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const ref = document.referrer || "";
  let referrer = "Direct";
  if (ref.includes("google")) referrer = "Google";
  else if (ref.includes("facebook") || ref.includes("fb.")) referrer = "Facebook";
  else if (ref.includes("instagram")) referrer = "Instagram";
  else if (ref.includes("linkedin")) referrer = "LinkedIn";
  else if (ref.includes("twitter") || ref.includes("t.co")) referrer = "Twitter / X";
  else if (ref.includes("whatsapp") || ref.includes("wa.me")) referrer = "WhatsApp";
  else if (ref.length > 0) referrer = new URL(ref).hostname;

  supabase
    .from("visits")
    .insert({ path: window.location.hash || "#home", referrer, device: isMobile ? "mobile" : "desktop", country: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown" })
    .then(({ error }) => { if (error) console.warn("Visit track error:", error.message); });
}

/** Record a contact form submission — fire-and-forget */
export function trackEnquiry(data: { name: string; business: string; phone: string; email: string; budget: string; message: string; type: string }) {
  supabase.from("enquiries").insert(data).then(({ error }) => { if (error) console.warn("Enquiry save error:", error.message); });
}

/** Fetch all data for dashboard */
export async function getStats() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);

  const [visitsRes, enquiriesRes, quotesRes, clientsRes] = await Promise.all([
    supabase.from("visits").select("*").order("created_at", { ascending: false }),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("quotes").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("*"),
  ]);

  const visits = visitsRes.data ?? [];
  const enquiries = enquiriesRes.data ?? [] as EnquiryRow[];
  const quotes = quotesRes.data ?? [];
  const clients = clientsRes.data ?? [];

  // Visitors
  const totalVisitors = visits.length;
  const visitorsToday = visits.filter((v: VisitRow) => v.created_at.startsWith(todayStr)).length;
  const visitorsWeek = visits.filter((v: VisitRow) => v.created_at.slice(0, 10) >= weekAgo).length;
  const visitorsMonth = visits.filter((v: VisitRow) => v.created_at.startsWith(monthStr)).length;

  // Returning visitors (path count > 1 for same country/device combo in last 30 days)
  const recentVisits = visits.filter((v: VisitRow) => {
    const d = new Date(v.created_at).getTime();
    return d > now.getTime() - 30 * 86400000;
  });
  const visitorKeys = new Set<string>();
  const returningCount = recentVisits.filter((v: VisitRow) => {
    const key = `${v.device}-${v.country}`;
    if (visitorKeys.has(key)) return true;
    visitorKeys.add(key);
    return false;
  }).length;

  // Enquiries & quotes
  const totalEnquiries = enquiries.length;
  const unreadEnquiries = enquiries.filter((e: EnquiryRow) => !e.is_read).length;
  const pendingQuotes = quotes.filter((q: any) => q.status === "pending").length;
  const acceptedQuotes = quotes.filter((q: any) => q.status === "accepted").length;

  // Traffic sources
  const sourceCounts: Record<string, number> = {};
  visits.forEach((v: VisitRow) => { sourceCounts[v.referrer] = (sourceCounts[v.referrer] || 0) + 1; });
  const trafficSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([source, count]) => ({ source, count }));

  // Top pages
  const pageCounts: Record<string, number> = {};
  visits.forEach((v: VisitRow) => { const p = v.path.replace("#", "") || "home"; pageCounts[p] = (pageCounts[p] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([page, count]) => ({ page, count }));

  // Countries
  const countryCounts: Record<string, number> = {};
  visits.forEach((v: VisitRow) => {
    let c = "Unknown";
    if (v.country.includes("Africa/Johannesburg") || v.country.includes("Africa/Cape_Town")) c = "South Africa";
    else if (v.country.includes("Africa")) c = "Africa (Other)";
    else if (v.country.includes("Europe/London")) c = "United Kingdom";
    else if (v.country.includes("America/")) c = "United States";
    else if (v.country.includes("Europe")) c = "Europe (Other)";
    else if (v.country.includes("Asia")) c = "Asia";
    else c = v.country.split("/")[0] || "Unknown";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const countries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).map(([country, count]) => ({ country, count }));

  // Devices
  const mobileCount = visits.filter((v: VisitRow) => v.device === "mobile").length;
  const desktopCount = visits.filter((v: VisitRow) => v.device === "desktop").length;

  // Daily visitors (last 14 days)
  const dailyVisitors: { date: string; visitors: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = visits.filter((v: VisitRow) => v.created_at.startsWith(dateStr)).length;
    dailyVisitors.push({ date: d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }), visitors: count });
  }

  // Monthly revenue (quotes accepted/converted)
  const monthlyRevenue: { date: string; revenue: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now); d.setMonth(d.getMonth() - i);
    const mStr = d.toISOString().slice(0, 7);
    const monthQuotes = quotes.filter((q: any) => q.created_at.startsWith(mStr) && (q.status === "accepted" || q.status === "converted"));
    const revenue = monthQuotes.reduce((sum: number, q: any) => sum + (q.total_amount || 0), 0);
    monthlyRevenue.push({ date: d.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }), revenue });
  }

  // Active clients
  const activeClients = clients.filter((c: any) => c.status === "active" || c.status === "lead").length;

  return {
    totalVisitors, visitorsToday, visitorsWeek, visitorsMonth,
    returningCount,
    totalEnquiries, unreadEnquiries,
    pendingQuotes, acceptedQuotes,
    activeClients,
    trafficSources, topPages, countries,
    mobileCount, desktopCount, dailyVisitors, monthlyRevenue,
    enquiries, quotes, clients,
  };
}

export async function clearAnalytics() {
  await Promise.all([
    supabase.from("visits").delete().gt("id", "00000000-0000-0000-0000-000000000000"),
    supabase.from("enquiries").delete().gt("id", "00000000-0000-0000-0000-000000000000"),
  ]);
}
