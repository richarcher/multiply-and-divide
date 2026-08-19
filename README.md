# Multiply & Divide

A small web app for practising multiplication and division facts. Sister project to [List & Lys](https://github.com/richarcher/list) — same stack and conventions.

**Live:** [https://multiply-and-divide.richarcher.co.za](https://multiply-and-divide.richarcher.co.za)

---

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use **Preview** to test the production build:

```bash
npm run build
npm run preview
```

---

## Deployment

- **Build:** `npm run build` → output in `dist/`.
- **Deploy:** Pushing to **`main`** runs the GitHub Action: it builds, syncs `dist/` to S3, and invalidates the CloudFront cache. No manual deploy step.

Setup (S3, CloudFront, DNS, GitHub secrets, IAM) is described in **`docs/DEPLOYMENT.md`**.

---

## Stack

- **Vite** + **Vue 3**
- **Tailwind CSS** + **daisyUI**
- **PWA** (installable, offline-capable) via `vite-plugin-pwa`
- **Static hosting:** S3 + CloudFront
