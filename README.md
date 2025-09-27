
# Éclat Reborn — Premium Crystal Buyback (Vercel‑Ready)

A luxury single-page site for second‑hand crystal buyback. Serverless **Express** on Vercel, **EJS** templating, and **Vercel Blob** for uploads.

## Deploy (no domain needed)
1. Push this folder to a new GitHub repo.
2. Vercel → **New Project** → Import the repo → Framework: **Other** → Deploy.
3. Create a Blob token: Vercel → **Storage → Blob → Access Tokens → New (Read/Write)**.
4. Project → **Settings → Environment Variables**:
   - `BLOB_READ_WRITE_TOKEN` = *(paste token)*
   - Environment: Production (+ Preview if desired)
5. **Redeploy**. Your site is live at `https://<project>.vercel.app`.

> Config is minimal: `vercel.json` only defines routes. No custom runtime fields (prevents build errors).

## Local dev
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Customize
- Hero image URL: `views/index.ejs` (Unsplash).
- Brand/contact: `views/layout.ejs` (footer + nav).
- Style: `public/css/styles.css`.
- Pricing tiers: `api/index.mjs` and `public/js/pricing.js`.

---

**Copy pillars**
- 專業鑑定｜透明流程｜快速收款  
- 奢華體驗，讓每一件水晶重焕光彩。
