# E-Waste Chittagong — Corporate Website & Admin Portal

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A premium, international-standard B2B corporate digital presence for **E-Waste Chittagong**, an electronics recycling and metal recovery enterprise located strategically near the Port of Chittagong, Bangladesh.

---

## Key Features

1. **Brand Identity**:
   - Preserves official PNG logo (`assets-source/E-Waste-Chittagong-logo.png`).
   - Algorithmic color tokens: Forest Green (`#005028`), Recycling Emerald (`#00A651`), Global Tech Blue (`#0078D8`), and Deep Navy (`#0A192F`).
   - High-contrast dark mode container ensures logo artwork stands out cleanly.

2. **4-Language Internationalization (`next-intl`)**:
   - **English (`/en`)**: Default international B2B commerce language.
   - **Bengali (`/bn`)**: Native localized experience for regional clients and suppliers.
   - **Simplified Chinese (`/zh-CN`)**: Dedicated localization for East Asian smelters and traders.
   - **Japanese (`/ja`)**: Dedicated localization for Japanese refiners and recycling consortiums.
   - Active page path preservation when switching languages.

3. **Theme System (`next-themes`)**:
   - Light mode and Dark mode with system preference detection and zero-FOUC state persistence.

4. **B2B Product Catalogue**:
   - Filterable catalogue with search, category pills, and technical specs.
   - Details view with grade, origin port, packaging format, and minimum order quantity (MOQ).
   - "Inquire About This Product" direct quote workflow.

5. **International RFQ Inquiry System**:
   - Validated submission with honeypot spam protection.
   - Generates instant inquiry tracking codes (e.g., `EWC-2026-XXXX`).
   - 5-stage status workflow: `NEW` ➔ `CONTACTED` ➔ `IN_PROGRESS` ➔ `QUOTED` ➔ `CLOSED`.
   - CSV export capability for the commercial export desk.

6. **Administrative Management Panel (`/admin`)**:
   - Role-Based Access Control (`SUPER_ADMIN` and `CONTENT_MANAGER`).
   - Real database KPI metrics dashboard.
   - Product catalogue CRUD with multi-language inputs (EN, BN, ZH, JA).
   - Category taxonomy management.
   - Media gallery manager with authentic vs illustrative verification badges.
   - Admin user creation and role configuration (Super Admin only).
   - Security audit trail.

7. **Original Photographic Assets**:
   - High-resolution editorial photography of server motherboards, CPU processor scrap, telecommunication transceiver boards, and clean disassembly facilities.

---

## Credentials (Local Development)

- **Super Admin**:
  - Email: `admin@ewastechittagong.com`
  - Password: `Admin@EWC2026!`
- **Content Manager**:
  - Email: `manager@ewastechittagong.com`
  - Password: `Manager@EWC2026!`

---

## Local Setup & Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Database Sync & Seeding
npx prisma db push
node scripts/seed.mjs
node scripts/seed-gallery.mjs

# 3. Run Development Server
npm run dev
# Website available on http://localhost:3000

# 4. Production Build & Start
npm run build
npm start
```

---

## Automated Verification Tests

```bash
# Run API and SSR unit tests
node scripts/verify-site.mjs

# Run full browser audit across viewports (requires Edge or Chrome)
node scripts/browser-audit.mjs
```

---

## Production Deployment Guide (Budget-Conscious)

1. **Database (PostgreSQL / Supabase)**:
   - Create a free project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
   - Copy connection string into `.env`:
     ```env
     DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres?sslmode=require"
     ```
   - In `prisma/schema.prisma`, change datasource provider from `"sqlite"` to `"postgresql"`.
   - Run `npx prisma db push` and `node scripts/seed.mjs`.

2. **Hosting (Vercel / Cloudflare Pages / VPS)**:
   - Connect repository to Vercel (free tier).
   - Set environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET` (generate 32+ random characters)
     - `NEXT_PUBLIC_SITE_URL` (e.g. `https://ewastechittagong.com`)
   - Build Command: `npm run build`
   - Output Directory: `.next`
