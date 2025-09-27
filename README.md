
# Éclat Reborn — Vercel Deployable

A prestige single-page buyback site for second-hand crystals, with:
- Serverless Express on Vercel
- EJS views + express-ejs-layouts
- In‑memory uploads via `multer` → stored on **Vercel Blob (public)**

## 1) Prerequisites
- A GitHub account
- A Vercel account (free)

## 2) Setup Blob access token
In Vercel: **Storage → Blob → Access Tokens** → create a Read/Write token.  
Then in your **Project → Settings → Environment Variables**, add:
- `BLOB_READ_WRITE_TOKEN` = the token you created

## 3) Deploy
1. Push this folder to a new GitHub repo.
2. Go to **vercel.com → New Project → Import Git Repository**.
3. Framework preset: **Other** (defaults are fine).
4. **Deploy**.
5. You’ll get a public URL like `https://your-project.vercel.app`.

> Local dev (optional):  
> ```bash
> npm install
> npm run dev
> # open http://localhost:3000
> ```

## 4) Notes
- All uploads are saved to **Vercel Blob** and displayed on the Thanks page.
- No custom domain needed; you can add one later.
- Edit brand copy in `views/layout.ejs` and styles in `public/css/styles.css`.
