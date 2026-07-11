-- ═════════════════════════════════════════════════════════════════════════════
-- WebHaven Agency Platform — Full Database Schema
-- Run ALL of this in Supabase SQL Editor
-- ═════════════════════════════════════════════════════════════════════════════

-- ── 1. Visits ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  path       TEXT NOT NULL DEFAULT '#home',
  referrer   TEXT NOT NULL DEFAULT 'Direct',
  device     TEXT NOT NULL DEFAULT 'desktop',
  country    TEXT NOT NULL DEFAULT 'Unknown'
);

-- ── 2. Enquiries (contact form submissions) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name       TEXT NOT NULL,
  business   TEXT DEFAULT '',
  phone      TEXT DEFAULT '',
  email      TEXT DEFAULT '',
  budget     TEXT DEFAULT '',
  message    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'contact',  -- contact | quote | testimonial
  is_read    BOOLEAN NOT NULL DEFAULT false,
  status     TEXT NOT NULL DEFAULT 'new',      -- new | read | replied | archived
  notes      TEXT DEFAULT ''
);

-- ── 3. Clients (CRM) ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  name         TEXT NOT NULL,
  company      TEXT DEFAULT '',
  email        TEXT DEFAULT '',
  phone        TEXT DEFAULT '',
  website      TEXT DEFAULT '',
  industry     TEXT DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'lead',   -- lead | active | completed | inactive
  package      TEXT DEFAULT '',                -- starter | business | online_store | custom
  budget       TEXT DEFAULT '',
  notes        TEXT DEFAULT '',
  avatar_url   TEXT DEFAULT ''
);

-- ── 4. Quotes ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  business        TEXT DEFAULT '',
  email           TEXT DEFAULT '',
  phone           TEXT DEFAULT '',
  industry        TEXT DEFAULT '',
  budget          TEXT DEFAULT '',
  services        TEXT[] DEFAULT '{}',
  message         TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | accepted | rejected | converted
  notes           TEXT DEFAULT '',
  total_amount    NUMERIC(10,2) DEFAULT 0,
  is_converted    BOOLEAN NOT NULL DEFAULT false
);

-- ── 5. Projects (Portfolio) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  title         TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'Website',
  description   TEXT NOT NULL,
  result        TEXT DEFAULT '',
  image_url     TEXT DEFAULT '',
  url           TEXT DEFAULT '',
  technologies  TEXT[] DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- ── 6. Testimonials ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  company       TEXT DEFAULT '',
  role          TEXT DEFAULT '',
  text          TEXT NOT NULL,
  rating        INTEGER NOT NULL DEFAULT 5,
  photo_url     TEXT DEFAULT '',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- ── 7. Services ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  icon          TEXT DEFAULT '',
  features      TEXT[] DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- ── 8. Pricing Packages ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_packages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  price         TEXT NOT NULL,
  description   TEXT NOT NULL,
  features      TEXT[] DEFAULT '{}',
  is_popular    BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- ── 9. Blog Posts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  excerpt       TEXT DEFAULT '',
  content       TEXT NOT NULL,
  featured_image TEXT DEFAULT '',
  category      TEXT DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ
);

-- ── 10. Appointments ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_name   TEXT NOT NULL,
  email         TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  service       TEXT DEFAULT '',
  date          DATE NOT NULL,
  time          TIME NOT NULL,
  notes         TEXT DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled | completed
  is_rescheduled BOOLEAN NOT NULL DEFAULT false
);

-- ── 11. Invoices ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  invoice_number  TEXT UNIQUE NOT NULL,
  client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name     TEXT NOT NULL,
  client_email    TEXT DEFAULT '',
  items           JSONB DEFAULT '[]',
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat             NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'draft', -- draft | sent | paid | overdue | cancelled
  due_date        DATE,
  notes           TEXT DEFAULT '',
  paid_amount     NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ── 12. Website Projects (internal tracking) ────────────────────────────────
CREATE TABLE IF NOT EXISTS website_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_name     TEXT NOT NULL,
  domain          TEXT DEFAULT '',
  hosting_provider TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'in_progress', -- planning | in_progress | completed | maintenance | paused
  renewal_date    DATE,
  monthly_cost    TEXT DEFAULT '',
  cms             TEXT DEFAULT '',
  notes           TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_website_projects_status ON website_projects (status);
CREATE INDEX IF NOT EXISTS idx_website_projects_domain ON website_projects (domain);

ALTER TABLE website_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth full website_projects" ON website_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 13. Settings (site config) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key             TEXT PRIMARY KEY,
  value           TEXT NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_visits_created_at       ON visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_path             ON visits (path);
CREATE INDEX IF NOT EXISTS idx_visits_referrer         ON visits (referrer);
CREATE INDEX IF NOT EXISTS idx_visits_device           ON visits (device);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at    ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status        ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_clients_status          ON clients (status);
CREATE INDEX IF NOT EXISTS idx_clients_email           ON clients (email);
CREATE INDEX IF NOT EXISTS idx_quotes_status           ON quotes (status);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id        ON quotes (client_id);
CREATE INDEX IF NOT EXISTS idx_projects_published      ON projects (is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_published  ON testimonials (is_published, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_active         ON services (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_active          ON pricing_packages (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_published          ON blog_posts (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_date       ON appointments (date, time);
CREATE INDEX IF NOT EXISTS idx_invoices_status         ON invoices (status);
CREATE INDEX IF NOT EXISTS idx_invoices_number         ON invoices (invoice_number);

-- ── Default Data: Services ───────────────────────────────────────────────────
INSERT INTO services (title, description, icon, features, sort_order) VALUES
('Business websites', 'A clear, credible online home designed to turn visitors into enquiries.', '🏢', ARRAY['Responsive mobile-first layouts', 'Custom branding', 'Contact forms & WhatsApp', 'Basic SEO setup'], 1),
('Website redesigns', 'A sharper look, simpler journey, and better performance for an outdated site.', '🔄', ARRAY['Modern design refresh', 'Improved user experience', 'Performance optimisation', 'Content restructuring'], 2),
('Online stores', 'Easy-to-shop storefronts that make your products feel worth choosing.', '🛒', ARRAY['Product catalogue', 'Secure checkout', 'Payment integration', 'Inventory management'], 3),
('Care & support', 'Hosting setup, updates, and practical help long after your website goes live.', '🛡️', ARRAY['Reliable hosting', 'Security updates', 'Content updates', 'Performance monitoring'], 4)
ON CONFLICT DO NOTHING;

-- ── Default Data: Pricing ────────────────────────────────────────────────────
INSERT INTO pricing_packages (name, price, description, features, is_popular, sort_order) VALUES
('Starter', 'From R1,499', 'For a new business that needs a polished first impression.', ARRAY['1-3 pages', 'Mobile responsive', 'WhatsApp integration', 'Basic SEO setup'], false, 1),
('Business', 'From R2,999', 'For an established business ready to attract more enquiries.', ARRAY['Up to 6 pages', 'Custom contact forms', 'Google Maps setup', 'Performance optimisation'], true, 2),
('Online store', 'Custom quote', 'For businesses ready to sell products or services online.', ARRAY['Product catalogue', 'Secure checkout', 'Payment setup', 'Store training'], false, 3)
ON CONFLICT DO NOTHING;

-- ── Default Data: Settings ───────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
('business_name', 'WebHaven'),
('tagline', 'Building websites that grow businesses.'),
('email', 'OfficialWebHaven@gmail.com'),
('phone', '076 980 8265'),
('phone_link', '+27769808265'),
('whatsapp', 'https://wa.me/27769808265'),
('instagram', 'https://www.instagram.com/officialwebhaven'),
('facebook', 'https://www.facebook.com/officialwebhaven'),
('linkedin', 'https://www.linkedin.com'),
('address', 'South Africa'),
('hero_headline', 'WebHaven'),
('hero_subheadline', 'Websites built to grow your business.'),
('hero_description', 'Fast, modern websites for South African businesses ready to look credible and win more customers.')
ON CONFLICT (key) DO NOTHING;

-- ── Row Level Security (RLS) ─────────────────────────────────────────────────
ALTER TABLE visits       ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;

-- Public inserts (contact forms, tracking)
CREATE POLICY "Anon insert visits" ON visits FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon insert enquiries" ON enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon insert appointments" ON appointments FOR INSERT TO anon WITH CHECK (true);

-- Public reads (for public website display)
CREATE POLICY "Public read published projects" ON projects FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public read published testimonials" ON testimonials FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public read active services" ON services FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read active pricing" ON pricing_packages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public read published blog" ON blog_posts FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public read settings" ON settings FOR SELECT TO anon USING (true);

-- Authenticated: full CRUD on everything
CREATE POLICY "Auth full visits" ON visits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full enquiries" ON enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full quotes" ON quotes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full pricing" ON pricing_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full blog" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full appointments" ON appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
