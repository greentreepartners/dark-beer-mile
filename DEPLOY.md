# Deploy workflow — Dark Beer Mile

Your code lives on GitHub. Netlify builds and publishes it automatically on every push to `main`.

**Repository:** https://github.com/greentreepartners/dark-beer-mile

```
Cursor (local)  →  git push  →  GitHub  →  Netlify  →  darkbeermile.com
```

---

## One-time: Connect Netlify to GitHub

1. Open [Netlify Dashboard](https://app.netlify.com) and sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorize Netlify if prompted.
4. Select the **`greentreepartners/dark-beer-mile`** repository.
5. Confirm build settings (also defined in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 22 (set automatically via `netlify.toml`)
6. Click **Deploy site**.

The first build should succeed. Netlify assigns a temporary URL like `https://something-random.netlify.app`.

---

## One-time: Custom domain (darkbeermile.com)

1. In Netlify, open your site → **Site configuration → Domain management**.
2. Click **Add a domain** and enter `darkbeermile.com`.
3. Add `www.darkbeermile.com` as well (recommended).
4. Netlify shows DNS records to add at your domain registrar.

**Typical DNS records at your registrar:**

| Type  | Name | Value                                      |
|-------|------|--------------------------------------------|
| A     | `@`  | Netlify load balancer IP (shown in Netlify) |
| CNAME | `www`| Your site’s `*.netlify.app` subdomain      |

Alternatively, point your domain’s nameservers to Netlify DNS and let Netlify manage everything.

5. Wait for DNS propagation (minutes to a few hours).
6. Netlify provisions HTTPS automatically once DNS is verified.

---

## Day-to-day development

```bash
cd /Users/errinhenderson/DBM
npm run dev       # local preview at http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

When ready to publish:

```bash
git add .
git commit -m "Describe your change"
git push
```

Netlify detects the push and redeploys automatically. Check progress under **Deploys** in the Netlify dashboard.

---

## Verify the pipeline

After Netlify is connected, confirm a deploy triggered by the latest push:

1. Open **Deploys** in Netlify — you should see a build for commit `Test deploy pipeline`.
2. When the deploy is **Published**, visit your Netlify URL or `https://darkbeermile.com` (once DNS is live).
3. You should see the Dark Beer Mile placeholder page with the tagline and “Coming soon.”

To test again later, change any text in `src/pages/index.astro`, commit, and push.
