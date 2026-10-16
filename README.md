# E-Waste Chittagong — Corporate Website & Admin Portal

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A premium, international-standard B2B corporate digital presence for **E-Waste Chittagong**, an electronics recycling and metal recovery enterprise located strategically near the Port of Chittagong, Bangladesh.

---

## Key Architecture & Features

1. **Brand Identity**:
   - Preserves official PNG logo (`assets-source/E-Waste-Chittagong-logo.png`).
   - Algorithmic color tokens: Forest Green (`#005028`), Recycling Emerald (`#00A651`), Global Tech Blue (`#0078D8`), and Deep Navy (`#0A192F`).
   - High-contrast dark mode container ensures logo artwork stands out cleanly.

2. **4-Language Internationalization (`next-intl`)**:
   - **English (`/en`)**: Default international B2B commerce language.
   - **Bengali (`/bn`)**: Native localized experience for regional clients and suppliers.
   - **Simplified Chinese (`/zh-CN`)**: Dedicated localization for East Asian smelters and traders.
   - **Japanese (`/ja`)**: Dedicated localization for Japanese refiners and recycling consortiums.
   - 100% complete parity across navigation, hero, about, services, process, gallery, product detail, inquiry forms, footer, and privacy policies.
   - Dynamic canonical and hreflang alternate meta tags on every route.

3. **Theme System (`next-themes`)**:
   - Light mode and Dark mode with system preference detection and zero-FOUC state persistence.

4. **B2B Product Catalogue**:
   - Filterable catalogue with search, category pills, and technical specs.
   - Details view with grade, origin port, packaging format, and minimum order quantity (MOQ).
   - "Inquire About This Product" direct quote workflow.

5. **International RFQ Inquiry System**:
   - Validated submission with honeypot spam protection.
   - IP-based rate limiting (15 requests/hour per IP).
   - Instant inquiry tracking codes (e.g., `EWC-2026-XXXX`).
   - 5-stage status workflow: `NEW` ➔ `CONTACTED` ➔ `IN_PROGRESS` ➔ `QUOTED` ➔ `CLOSED`.
   - CSV export capability for the commercial export desk.

6. **Administrative Management Panel (`/admin`)**:
   - Role-Based Access Control (`SUPER_ADMIN` and `CONTENT_MANAGER`).
   - Brute-force protection on `/api/admin/login` (5 attempts per 15 minutes with IP lockout).
   - Real database KPI metrics dashboard.
   - Product catalogue CRUD with multi-language inputs (EN, BN, ZH, JA).
   - Category taxonomy management.
   - Media gallery manager with authentic vs illustrative verification badges.
   - Admin user creation and role configuration (Super Admin only).
   - Security audit trail logging all sensitive operations.

7. **AI Asset Transparency**:
   - All AI-generated product and facility photography are explicitly flagged with `isVerified: false` ("Illustrative Concept / Material Representation") to maintain strict client and buyer transparency.

---

## Security & Admin Credentials

### Provisioning the Production Administrator
To prevent insecure default credentials in production, hardcoded admin seeding is disabled when `NODE_ENV=production`. To provision your first administrator, run:

```bash
# Interactive mode (prompts for Name, Email, and Password):
node scripts/create-admin.mjs

# Or via environment variables:
ADMIN_NAME="Operations Executive" \
ADMIN_EMAIL="admin@ewastechittagong.com" \
ADMIN_PASSWORD="YourStrongPassword123!" \
node scripts/create-admin.mjs
```

> **Password Policy**: Passwords must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters. Hashed via bcrypt with cost factor 12.

### Local Development Test Accounts
In local development only (`NODE_ENV=development`), `scripts/seed.mjs` sets up test accounts for testing convenience:
- **Super Admin**: `admin@ewastechittagong.com` / `Admin@EWC2026!`
- **Content Manager**: `manager@ewastechittagong.com` / `Manager@EWC2026!`

---

## Local Setup & Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Database Sync & Seeding (SQLite by default)
npx prisma db push
node scripts/seed.mjs
node scripts/seed-gallery.mjs

# 3. Environment Audit
node scripts/check-env.mjs

# 4. Run Development Server
npm run dev
# Website available on http://localhost:3000

# 5. Production Build & Start
npm run build
npm start
```

---

## Database Management & Backup

### 1. Snapshotting the Database
```bash
node scripts/db-backup.mjs
# Creates timestamped backup in ./backups/sqlite-ewc-<timestamp>.db
```

### 2. Switching to Production PostgreSQL (Serverless / Cloud)
For serverless hosting (e.g. Vercel, Supabase, Neon) where SQLite files are ephemeral:
1. Create a free PostgreSQL instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Replace `prisma/schema.prisma` with `prisma/schema.postgresql.prisma` (or change `provider = "postgresql"`).
3. Set `DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"` in `.env`.
4. Run `npx prisma db push` to initialize tables.
5. Provision the administrator via `node scripts/create-admin.mjs`.

---

## Automated Verification Tests

```bash
# Run API and SSR unit tests
node scripts/verify-site.mjs

# Run full browser audit across viewports (requires Edge or Chrome)
node scripts/browser-audit.mjs
```

---

## External Services & Production Deployment Checklist

### Required External Services
1. **Domain Registration**: e.g., `ewastechittagong.com` (~$10-12/yr via Cloudflare Registrar, Namecheap, or Google Domains).
2. **DNS & SSL**: Cloudflare Free Tier (recommended for DDoS protection, global edge caching, and free SSL).
3. **Application Hosting**:
   - *Option A (Zero-cost Serverless)*: Vercel Free Hobby Tier (pair with managed PostgreSQL below).
   - *Option B (Self-hosted / VPS)*: DigitalOcean Droplet / Hetzner Cloud (~$4-6/mo) with persistent SQLite or Dockerized Postgres.
4. **Managed Database (If using Option A)**: Supabase Free Tier (500MB storage, pooled connections) or Neon Free Tier.
5. **Business Email Hosting**: Google Workspace or Zoho Mail Free/Standard for `info@ewastechittagong.com`.

### Client Content Signoff Checklist
Before public DNS cutover, obtain formal client confirmation on:
- [ ] Official corporate phone number and WhatsApp routing number (currently using placeholder with disclaimer).
- [ ] Physical street address/plot number for the Chittagong facility.
- [ ] Trade license, TIN, and Department of Environment (DoE) clearance document numbers.
- [ ] Replacement of illustrative AI images with real high-resolution photographs of the physical warehouse and sorting floor as they become available.
- [ ] Official banking coordinates for international Letter of Credit (LC) and Telegraphic Transfer (TT).
