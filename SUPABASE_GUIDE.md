# WebHaven — Full Setup Guide

## 1. Create a Supabase Project
1. Go to https://supabase.com → Sign up → **New Project**
2. Pick a name, database password, and region (South Africa / Europe recommended)
3. Wait ~2 minutes

## 2. Run the Database Setup
1. Go to **SQL Editor** → **"+ New Query"**
2. Copy the entire contents of `SUPABASE_SETUP.sql` and paste
3. Click **Run** — you should see 14 tables listed at the bottom

## 3. Enable Email Auth
1. Go to **Authentication** → **Providers** → **Email**
2. Make sure it's **Enabled**
3. (Optional) Disable "Confirm email" for instant admin access:
   - **Authentication** → **Settings** → uncheck "Confirm email"

## 4. Get Your API Credentials
1. Go to **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → `https://xxxxxxxx.supabase.co`
   - **anon public key** → `eyJhbGci...`
3. Open `src/lib/supabase.ts` and update the URL + key

## 5. Build & Deploy
```bash
npm run build
```
Deploy the `dist/index.html` to Netlify, Vercel, or your host.

## 6. Access the Admin Dashboard
Navigate to: `https://yourwebsite.com/#admin`

- Click **"No account? Create one"** to register your first admin
- Sign in with email + password

---

## What You Get — Complete Feature List

### Public Website
| Feature | Details |
|---------|---------|
| **Hero section** | Animated, gradient text, CTAs |
| **Services** | 4 services with expandable details |
| **Portfolio** | Empty state until you add real projects |
| **Founding Client Offer** | "First 5 clients get lower price" |
| **Pricing** | 3 packages (Starter, Business, Online Store) |
| **Testimonials** | Honest empty state + submission form |
| **FAQ** | 5 questions with accordion |
| **Contact** | Form + WhatsApp + email + phone + socials |
| **SEO** | Meta tags, Open Graph, Twitter Cards, structured data, sitemap, robots.txt |
| **UX** | Scroll progress bar, back-to-top button, smooth scroll |

### Admin Dashboard (14 tabs)
| Tab | What it does |
|-----|-------------|
| **Overview** | Visitors (total/today/week/month), enquiries, quotes, clients, revenue chart, traffic sources, top pages, regions, device split |
| **Enquiries** | All contact form submissions — search, filter, read/unread, archive, delete, reply via email/WhatsApp |
| **Clients** | Full CRM — add/edit/delete clients, search, filter by status (lead/active/completed/inactive) |
| **Quotes** | Quote requests — accept, reject, convert to client |
| **Portfolio** | Add/manage projects — publish, feature, delete |
| **Testimonials** | Add/manage testimonials — publish, feature, star ratings |
| **Services** | Inline edit service titles and descriptions, toggle active |
| **Pricing** | Inline edit pricing packages, popular badge toggle |
| **Bookings** | Appointment calendar — book, confirm, cancel, search |
| **Invoices** | Create invoices with line items, VAT calculation, print/PDF export, mark as paid/sent |
| **Blog** | Write, draft, publish, search blog posts |
| **Sites** | Track client websites — domain, hosting, renewal dates, monthly cost, CMS |
| **Files** | File manager placeholder (requires Supabase Storage bucket setup) |
| **Settings** | Edit all site config inline — business name, tagline, contact info, socials |

### Security
- ✅ Supabase Auth (email/password) — no hardcoded passwords
- ✅ Row Level Security on all 14 tables
- ✅ Only authenticated users can CRUD admin data
- ✅ Public can only read published content and submit forms
- ✅ Passwords never stored in frontend code

### SEO
- ✅ Dynamic meta descriptions
- ✅ Open Graph tags (title, description, image, URL, locale)
- ✅ Twitter Card (summary_large_image)
- ✅ Canonical URL
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Schema.org: LocalBusiness structured data
- ✅ Schema.org: BreadcrumbList structured data

---

## Future Features (ready to build on this foundation)
- **Email notifications** via Resend.com (add Supabase Edge Function)
- **Real GA4 integration** (replace `G-XXXXXXXXXX` in index.html + use GA4 Reporting API)
- **File uploads** (create "files" bucket in Supabase Storage)
- **PDF invoices** (jsPDF library + print-to-PDF is already implemented)
- **Rich text editor** for blog (add TipTap or Quill)
- **Public blog page** (create /#blog route that reads from Supabase)
- **Public appointment booking form** (add to contact section)
