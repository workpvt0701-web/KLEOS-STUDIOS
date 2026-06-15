# KLEOS — Deployment Guide

Written for a complete beginner. Follow it top to bottom. Copy commands exactly.

There are two halves to this site:

- **Frontend** (the website people see) → goes free on **GitHub Pages**
- **Backend** (contact form + analytics) → goes free on **Render.com** — *optional, add it later*

You can put the **frontend online today** without touching the backend. The contact form will work in "demo mode" (shows the success message) until you connect the backend or Formspree. Do the frontend first, celebrate, then come back for the backend when you're ready.

---

## PART 0 — Install your tools (one time)

1. **Node.js** (only needed for the backend later, but install it now)
   Download the "LTS" version: https://nodejs.org
   After installing, open a terminal and check it worked:
   ```
   node -v
   ```
   You should see a version number like `v20.x.x`.

2. **VS Code** (the editor you'll write in)
   https://code.visualstudio.com

3. **Git** (uploads your code to GitHub)
   https://git-scm.com/downloads
   Check it worked:
   ```
   git -v
   ```

4. **A GitHub account** (free): https://github.com

---

## PART 1 — Put the frontend online (GitHub Pages)

### 1.1 Create the repository
1. Go to https://github.com/new
2. Repository name: `kleos-website`
3. Set it to **Public**
4. Click **Create repository**. Leave the page open — you'll need the commands it shows.

### 1.2 Upload your files
Open a terminal **inside the `kleos-website` folder** on your computer.
(Tip: open the folder in VS Code, then Terminal → New Terminal.)

Run these one at a time:
```
git init
git add .
git commit -m "First version of Kleos website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kleos-website.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your real GitHub username.

### 1.3 Turn on GitHub Pages
1. On your repo page, go to **Settings → Pages**.
2. Under "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)** … but our site lives in `frontend/`.
   The simplest fix: see the note below.

**Important folder note:** GitHub Pages serves from the root or `/docs`.
Our files are in `frontend/`. Two easy options — pick one:

- **Option A (easiest):** In your repo, move everything from `frontend/` into the root, OR
- **Option B:** Rename the `frontend` folder to `docs`, then in Settings → Pages pick folder **/docs**.

After saving, wait 1–2 minutes. Your site will be live at:
```
https://YOUR-USERNAME.github.io/kleos-website/
```

### 1.4 Update your real URLs
Now that you know your live URL, open these files and replace every
`YOUR-SITE-URL.com` with your real address:
- `index.html` (the og:url meta tag)
- `sitemap.xml`
- `robots.txt`

Save, then push the change (see Part 5 for how to push updates).

---

## PART 2 — The contact form (pick ONE)

### Option A — Formspree (no backend, easiest)
1. Sign up free at https://formspree.io
2. Create a form, copy your form ID (looks like `xayzabcd`).
3. Open `animations.js`, find the comment block in section 12 (CONTACT FORM).
4. Replace the simulated `setTimeout(...)` block with the Formspree `fetch` shown in the comment, using your ID.
5. Push the update. Done — enquiries now arrive in your email.

### Option B — Your own backend (more powerful, adds analytics)
Continue to Part 3.

---

## PART 3 — MongoDB Atlas (free database, for analytics)

*Only needed if you want view-tracking and the admin analytics tab.*

1. Sign up free: https://www.mongodb.com/cloud/atlas/register
2. Create a **free M0 cluster** (pick the free tier, any region near you).
3. **Database Access** → Add New Database User → set a username + password (save them).
4. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
5. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxx.mongodb.net/kleos
   ```
   Replace `USERNAME` and `PASSWORD` with the user you made. This goes in `.env` as `MONGODB_URI`.

---

## PART 4 — Deploy the backend (Render.com)

1. Inside the `backend/` folder, copy `.env.example` to a new file named `.env`
   and fill in your real values (Gmail, app password, Mongo URI, admin password).
2. Push your code to GitHub (Part 5). **The `.env` file is gitignored — it will NOT upload, which is correct.**
3. Go to https://render.com → sign up → **New → Web Service**.
4. Connect your `kleos-website` GitHub repo.
5. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Under **Environment**, add each variable from your `.env` by hand
   (EMAIL, EMAIL_PASSWORD, MONGODB_URI, ADMIN_PASSWORD, FRONTEND_URL).
7. Click **Create Web Service**. Render gives you a URL like
   `https://kleos-backend.onrender.com`.

### Connect frontend to backend (one line each)
- In `animations.js` contact form: point the fetch at `https://kleos-backend.onrender.com/api/contact`.
- In `admin.html`: set `const API_BASE = 'https://kleos-backend.onrender.com';`

Push the update.

---

## PART 5 — How to push updates (you'll do this a lot)

Whenever you change anything:
```
git add .
git commit -m "Describe what you changed"
git push
```
GitHub Pages and Render both rebuild automatically within a minute or two.

---

## PART 6 — Adding your real images

1. Compress each PNG at https://tinypng.com (keeps the site fast).
2. Drop them in `frontend/assets/images/` (see the README there for names).
3. In each case study, swap the placeholder `<div class="cs-image">` for an
   `<img ... loading="lazy">` (the exact line is in the images README).
4. Add `og-image.png` (1200×630, KLEOS wordmark) for nice link previews.
5. Push the update.

---

## Quick checklist

- [ ] Frontend live on GitHub Pages
- [ ] Real URL swapped into index.html / sitemap.xml / robots.txt
- [ ] Contact form connected (Formspree OR backend)
- [ ] WhatsApp number added in index.html
- [ ] Real images + og-image added
- [ ] Akshay's real testimonial quote added
- [ ] 2026 timeline entry filled in after college admission
- [ ] Admin password changed from the default

That's it. The glory that outlives you — now online.
