# 🚀 Portfolio CMS — Deployment Guide (Vercel + Neon)

## Stack
- **Frontend/Backend**: Next.js 16 (App Router)
- **Database**: PostgreSQL via [Neon](https://neon.tech) (free tier)
- **Hosting**: [Vercel](https://vercel.com) (free tier)
- **ORM**: Drizzle ORM

---

## ✅ Step 1 — Free PostgreSQL Database on Neon

1. Go to **[neon.tech](https://neon.tech)** → Sign up free
2. Click **"New Project"** → Enter a project name (e.g., `portfolio-cms`)
3. Select your nearest region → Click **Create**
4. Copy the **Connection String** — it looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Save it — you'll need it in Step 3

---

## ✅ Step 2 — Push Code to GitHub

```bash
# Inside the project folder:
git init
git add .
git commit -m "Initial commit — portfolio CMS"

# Create a repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## ✅ Step 3 — Deploy to Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up / Log in with GitHub
2. Click **"Add New → Project"**
3. Import your GitHub repository
4. In **"Environment Variables"**, add these 4 variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | A random 32+ char string (see below) |
| `ADMIN_EMAIL` | `your-email@gmail.com` |
| `ADMIN_PASSWORD` | A strong password |

> **Generate JWT_SECRET — run this in terminal:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

5. Click **"Deploy"** — Vercel builds and deploys automatically ✅

---

## ✅ Step 4 — Setup Database (Run Once Locally)

Update your local `.env` with the **Neon** `DATABASE_URL`, then run:

```bash
# Push schema to Neon database
npm run db:migrate

# Seed initial data (admin user + sample portfolio)
npm run db:seed
```

Or run both at once:
```bash
npm run db:setup
```

> ⚠️ `db:seed` only needs to run once. Running again is safe (uses `ON CONFLICT DO NOTHING`).

---

## ✅ Step 5 — Access Your App

| URL | Purpose |
|---|---|
| `https://your-app.vercel.app` | Portfolio (public) |
| `https://your-app.vercel.app/admin/login` | Admin Login |
| `https://your-app.vercel.app/admin` | Admin Dashboard |

Login with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set.

---

## 🔄 Future Deployments (Automatic)

Every push to `main` auto-deploys. No extra steps:

```bash
git add .
git commit -m "your changes"
git push
```

---

## 🖼️ Image & File Hosting

> ⚠️ Vercel is **serverless** — local file uploads won't persist.

Use **external URLs** for profile photos, CV, and certificates:

| Service | Free | Best For |
|---|---|---|
| **Google Drive** | ✅ Free | CV / PDF files |
| **Cloudinary** | ✅ 25GB free | Images |
| **Supabase Storage** | ✅ 1GB free | Images + files |

Paste the public link directly in the Admin Dashboard fields.

---

## 🔧 Local Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO
cd YOUR_REPO
npm install
cp .env.example .env   # fill in values
npm run db:migrate
npm run db:seed
npm run dev
```

---

## 🗄️ All Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (with `?sslmode=require`) |
| `JWT_SECRET` | ✅ | Random 32+ char secret for JWT signing |
| `ADMIN_EMAIL` | ✅ | Admin account email |
| `ADMIN_PASSWORD` | ✅ | Admin account password (used at seed time) |

---

## 🛡️ Security Checklist

- [x] `.env` is in `.gitignore` — secrets never committed
- [x] `JWT_SECRET` is required — no insecure default
- [x] Auth cookies are `httpOnly` + `secure` in production
- [x] Database pool uses SSL (`rejectUnauthorized: false`) for Neon
- [x] Admin routes protected by JWT middleware
