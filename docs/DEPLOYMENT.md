# Deployment

This app is a Vue SPA deployed to S3 and served over HTTPS via CloudFront (same setup as List & Lys). This doc covers S3/SPA behaviour, the GitHub Actions pipeline, and CloudFront (HTTPS) setup. Replace `YOUR_DOMAIN` below with the real domain once one is chosen (e.g. `times.richarcher.co.za`).

## 1. S3 routing for the SPA

The app has client-side routing (no server-side routes). Any path must serve `index.html` so the Vue app can handle it. That's done in one of two ways.

### Option A: S3 static website hosting only (no CloudFront)

1. Enable **Static website hosting** on the bucket.
2. Set **Index document**: `index.html`.
3. Set **Error document**: `error.html`. The repo includes a dedicated `error.html` that redirects to `/` so the SPA loads.

Then use the **S3 website endpoint** URL (e.g. `http://bucket.s3-website-us-east-1.amazonaws.com`) for testing. For production you'll want CloudFront (or similar) in front for HTTPS and a custom domain.

### Option B: S3 + CloudFront (recommended for HTTPS)

When the origin is CloudFront → S3:

1. **Origin**: use either
   - the **S3 website endpoint** (e.g. `bucket.s3-website-us-east-1.amazonaws.com`), so S3's Error document = `index.html` applies, or
   - the **S3 bucket endpoint** (e.g. `bucket.s3.us-east-1.amazonaws.com`) and handle errors in CloudFront (below).

2. **CloudFront custom error responses** (if using the bucket endpoint, or to be safe in general):
   - **403** → Response: `200`, Response page: `/error.html` (or `/index.html`).
   - **404** → Response: `200`, Response page: `/error.html` (or `/index.html`).

That way direct hits and refreshes on any path return `index.html` and the SPA works.

## 2. GitHub Actions: build and sync to S3

Workflow: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

- **Trigger**: push to `main` (e.g. after merge).
- **Steps**: checkout → Node 24 → `npm ci` → `npm run build` → sync `dist/` to S3 (with cache headers) → optional CloudFront invalidation.

### Required GitHub secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key with S3 (and optionally CloudFront) access. |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key. |
| `S3_BUCKET` | Target bucket name (e.g. `YOUR_DOMAIN` or your bucket name). |

### Optional

| Secret | Description |
|--------|-------------|
| `AWS_REGION` | Region of the S3 bucket (default in workflow: `us-east-1`). |
| `CLOUDFRONT_DISTRIBUTION_ID` | If set, the workflow runs `aws cloudfront create-invalidation --paths "/*"` after upload so changes go live immediately. |

### IAM permissions for the deploy user

Minimum for S3 sync:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

If you use CloudFront invalidation, add:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:CreateInvalidation",
    "cloudfront:GetInvalidation"
  ],
  "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
}
```

## 3. HTTPS with CloudFront

CloudFront gives you HTTPS and a custom domain. Do **ACM first** (certificate), then **CloudFront** (distribution), then **DNS**. See List & Lys's `docs/DEPLOYMENT.md` for the full step-by-step (ACM in us-east-1, distribution settings, DNS CNAME) — the steps are identical, just substitute `YOUR_DOMAIN` for `list.richarcher.co.za`.

## 4. Cloudflare alternative

If you prefer Cloudflare for HTTPS and DNS instead of CloudFront, same approach as List & Lys: point the domain at Cloudflare, set SSL mode appropriately for the origin, and add a rule so 404/403 responses rewrite to `/index.html` for SPA routing.
