This is a Next.js (App Router) site configured for **static export** so it can be hosted on shared hosting (cPanel) without a backend.

## Getting Started

Install deps and run the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment

Copy `.env.example` to `.env.local` and update links/assets there.

```bash
cp .env.example .env.local
```

## Writing posts (Markdown)

Add Markdown files under `content/posts/` (example: `content/posts/2026-05-28-welcome.md`).

## Static build (for cPanel)

This repo uses `output: 'export'`, so build generates `out/`.

```bash
pnpm build
```

If you deploy to a subfolder (example: `https://domain.com/sub/`), use:

```bash
NEXT_PUBLIC_BASE_PATH=/sub pnpm build:path
```

Then upload `out/` contents to your cPanel `public_html/` (or the domain document root).

Subfolder deploy note:
- For `https://domain.com/sub/`, upload `out/` contents to `public_html/sub/` (including `_next/`).

Notes:

- This is a fully static site: no Spring Boot / API needed.
- `next/image` is configured with `images.unoptimized = true` for static hosting.

## GitHub Actions deploy to cPanel

This repo includes [`.github/workflows/deploy.yml`](/Users/gpryan/windway/tblog/.github/workflows/deploy.yml:1) to build the static site and upload `out/` to your hosting automatically on every push to `master`.

### 1. Add repository secrets

GitHub repo -> `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Create these secrets:

- `FTP_SERVER`: FTP/FTPS host from cPanel
- `FTP_USERNAME`: FTP account username
- `FTP_PASSWORD`: FTP account password

### 2. Add repository variables

GitHub repo -> `Settings` -> `Secrets and variables` -> `Actions` -> `Variables` -> `New repository variable`

Required hosting variables:

- `FTP_TARGET_DIR`: `public_html/` for root domain, or `public_html/sub/` for a subfolder

Optional hosting variables:

- `FTP_PROTOCOL`: default is `ftps`
- `FTP_PORT`: default is `21`

Optional build variables:

- `NEXT_PUBLIC_BASE_PATH`: leave empty for root deploy, set `/sub` when deploying to `https://domain.com/sub/`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CV_PDF`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_PROFILE_AVATAR`
- `NEXT_PUBLIC_SOCIAL_IMAGE`
- `NEXT_PUBLIC_FAVICON`
- `NEXT_PUBLIC_GITHUB_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_LINKEDIN_URL`

If you do not set the optional `NEXT_PUBLIC_*` variables, the workflow uses the current site defaults already baked into the workflow.

### 3. Trigger deploy

Push to `master`, or run the workflow manually from the `Actions` tab.

### 4. Typical values

For root domain deploy:

- `NEXT_PUBLIC_BASE_PATH`: empty
- `FTP_TARGET_DIR`: `public_html/`

For subfolder deploy like `https://domain.com/sub/`:

- `NEXT_PUBLIC_BASE_PATH`: `/sub`
- `FTP_TARGET_DIR`: `public_html/sub/`
