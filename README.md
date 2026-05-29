This is a Next.js (App Router) site configured for **static export** so it can be hosted on shared hosting (cPanel) without a backend.

## Getting Started

Install deps and run the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Writing posts (Markdown)

Add Markdown files under `content/posts/` (example: `content/posts/2026-05-28-welcome.md`).

## Static build (for cPanel)

This repo uses `output: 'export'`, so build generates `out/`.

```bash
pnpm build
```

If you deploy to a subfolder (example: `https://domain.com/ok/`), use:

```bash
NEXT_PUBLIC_BASE_PATH=/ok pnpm build:path
```

Then upload `out/` contents to your cPanel `public_html/` (or the domain document root).

Subfolder deploy note:
- For `https://domain.com/ok/`, upload `out/` contents to `public_html/ok/` (including `_next/`).

Notes:

- This is a fully static site: no Spring Boot / API needed.
- `next/image` is configured with `images.unoptimized = true` for static hosting.
