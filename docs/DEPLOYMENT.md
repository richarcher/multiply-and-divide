# Deployment: multiply-and-divide.richarcher.co.za

This app is a Vue SPA deployed to S3 and served over HTTPS via CloudFront (same setup as List & Lys). Infrastructure below is already provisioned in AWS account `059299345998`; this doc records what exists and how to reproduce it if it's ever rebuilt.

## Infrastructure (already provisioned)

| Resource | Value |
|---|---|
| S3 bucket | `multiply-and-divide.richarcher.co.za` (us-east-1) |
| CloudFront distribution | `E91S8RXV8YGL6` → `d3rj15z9sm8z4d.cloudfront.net` |
| Origin Access Control | `E2I8NV7WKDU4UE` (sigv4, S3 origin — bucket is otherwise private) |
| ACM certificate (us-east-1) | `arn:aws:acm:us-east-1:059299345998:certificate/6cac66c5-75e9-4a48-b530-1613ab79923e` |
| Route53 record | `multiply-and-divide.richarcher.co.za` A/ALIAS → CloudFront distribution (hosted zone `richarcher.co.za`) |
| IAM deploy user | `github-multiply-and-divide-deploy`, policy `MultiplyAndDivideDeployPolicy` (S3 read/write on this bucket only + CloudFront invalidation on this distribution only) |

The origin is the **S3 REST endpoint** (`multiply-and-divide.richarcher.co.za.s3.us-east-1.amazonaws.com`) with CloudFront **Origin Access Control**, not the legacy S3 website-endpoint + public-bucket approach — the bucket has no public access and no static-website config; CloudFront is the only reader, via the bucket policy's `AWS:SourceArn` condition. This mirrors List & Lys's current (newer) distribution rather than its older website-endpoint one.

No custom error responses are configured (matches the live List & Lys distribution) — fine while the app has no client-side routes beyond `/`. If routes are added later, add CloudFront custom error responses for 403/404 → `/index.html` (response code 200), or switch the origin to the S3 website endpoint with `error.html` as the error document (see `public/error.html`, already in the repo for that path).

## GitHub Actions: build and sync to S3

Workflow: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

- **Trigger**: push to `main`.
- **Steps**: checkout → Node 24 → `npm ci` → `npm run build` → sync `dist/` to S3 (with cache headers) → CloudFront invalidation.

### Required GitHub secrets (repo Settings → Secrets and variables → Actions)

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | Access key for `github-multiply-and-divide-deploy` |
| `AWS_SECRET_ACCESS_KEY` | Secret key for `github-multiply-and-divide-deploy` |
| `S3_BUCKET` | `multiply-and-divide.richarcher.co.za` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E91S8RXV8YGL6` |

`AWS_REGION` isn't needed — the bucket is in `us-east-1`, the workflow's default.

## Rebuilding from scratch

If this infrastructure is ever deleted and needs recreating:

1. **ACM cert** (us-east-1, DNS validation) for the domain, then add the validation CNAME to Route53.
2. **Origin Access Control**: `aws cloudfront create-origin-access-control` (sigv4, S3 origin type).
3. **CloudFront distribution**: S3 REST-endpoint origin + the OAC above, `redirect-to-https`, cache policy `658327ea-f89d-4fab-a63d-7e88639e58f6` (CachingOptimized), the ACM cert, default root object `index.html`.
4. **Bucket policy**: allow `s3:GetObject` to principal `cloudfront.amazonaws.com` with condition `AWS:SourceArn` = the distribution's ARN.
5. **Route53**: A/ALIAS record for the domain → the distribution's CloudFront domain name (hosted zone `Z2FDTNDATAQYW2`).
6. **IAM**: policy scoped to `s3:PutObject/GetObject/DeleteObject/ListBucket` on the bucket + `cloudfront:CreateInvalidation/GetInvalidation` on the distribution; user with that policy attached; access key for GitHub secrets.

## Cloudflare alternative

If you'd rather use Cloudflare for HTTPS/DNS instead of CloudFront: point the domain at Cloudflare, set SSL mode appropriately for the origin, and add a rule so 404/403 responses rewrite to `/index.html` for SPA routing. Not used here — documented for parity with List & Lys's deployment doc.
