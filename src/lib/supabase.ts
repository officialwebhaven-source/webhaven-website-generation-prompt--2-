import { createClient } from "@supabase/supabase-js";

// ⚠️ REPLACE with your actual Supabase credentials
//   → https://supabase.com/dashboard → Project → Settings → API
declare global { interface ImportMeta { env: Record<string, string> } }
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL ?? "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? "your-anon-public-key-here";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signUpAdmin(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInAdmin(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  return supabase.auth.signOut();
}

export function onAuthStateChange(callback: (session: any) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type EnquiryRow = {
  id: string;
  created_at: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  budget: string;
  message: string;
  type: string;
  is_read: boolean;
  status: string;
  notes: string;
};

export type VisitRow = {
  id: string;
  created_at: string;
  path: string;
  referrer: string;
  device: string;
  country: string;
};

export type ClientRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  status: string;
  package: string;
  budget: string;
  notes: string;
  avatar_url: string;
};

export type QuoteRow = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  name: string;
  business: string;
  email: string;
  phone: string;
  industry: string;
  budget: string;
  services: string[];
  message: string;
  status: string;
  notes: string;
  total_amount: number;
  is_converted: boolean;
};

export type ProjectRow = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  type: string;
  description: string;
  result: string;
  image_url: string;
  url: string;
  technologies: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  created_at: string;
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  photo_url: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
};

export type PricingRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
};

export type BlogRow = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
};

export type AppointmentRow = {
  id: string;
  created_at: string;
  client_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  is_rescheduled: boolean;
};

export type InvoiceRow = {
  id: string;
  created_at: string;
  invoice_number: string;
  client_id: string | null;
  client_name: string;
  client_email: string;
  items: any;
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  due_date: string;
  notes: string;
  paid_amount: number;
};

export type SettingRow = {
  key: string;
  value: string;
  updated_at: string;
};
