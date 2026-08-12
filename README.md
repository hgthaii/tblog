# tblog

A minimal, atmospheric personal site and Markdown blog built with Next.js. It includes a responsive home page, writing archive, milestone timeline, CV viewer, route metadata, sitemap, custom error pages, and a static cPanel deployment workflow.

The project uses the App Router and static export, so the generated `out/` directory can be hosted without a Node.js server.

## Branch model

- `master` is the public template. It contains sample profile data, Lorem Ipsum milestones, example posts, and placeholder links.
- `production` is intended for the site owner's real content and is the only branch deployed by the included workflow.
- `dev` can be used for feature work before changes are merged into `master` or `production`.

The `production` branch is still visible when the repository is public. Use a separate private repository if your content must not be publicly accessible in Git history.

## Use this template

Fork the repository or select **Use this template** on GitHub, then clone your copy:

```bash
git clone https://github.com/your-username/tblog.git
cd tblog
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Personalize the site

Update these files:

- `content/locales/vi.json`: profile copy, navigation labels, milestones, and CV labels.
- `content/posts/*.md`: Markdown blog posts. The filename becomes the post slug.
- `.env.local`: website URL, avatar, CV, email, and social links.
- `public/avatar.svg`: sample avatar.
- `public/og-image.png`: default Open Graph image. Keep it at `1200 x 630` for reliable social previews.
- `public/icon.svg` and `app/favicon.ico`: site icons.

A post uses this frontmatter format:

```md
---
title: "My first post"
createdAt: "01/01/2025"
authorName: "Your name"
category: "notes, personal"
---

Write the post here.
```

## Create a personal production branch

Keep the reusable template on `master` and create your content branch once:

```bash
git switch -c production
```

Replace the sample content, commit it, and push the branch:

```bash
git add .
git commit -m "Personalize site content"
git push -u origin production
```

When template code changes later, merge `master` into `production` and keep the personal versions of your content files when resolving conflicts.

## Quality checks

```bash
pnpm lint
pnpm build
```

The static output is written to `out/`.

For a subfolder deployment such as `https://example.com/blog/`, use:

```bash
NEXT_PUBLIC_BASE_PATH=/blog pnpm build:path
```

## Automatic cPanel deployment

The workflow in `.github/workflows/deploy.yml` runs only for the `production` branch. It builds the static site, uploads immutable assets before pages, verifies production, creates a versioned GitHub Release, and can send a Telegram notification.

Add these repository secrets under **Settings -> Secrets and variables -> Actions**:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)

Add these required repository variables:

- `FTP_TARGET_DIR`: for example `public_html/`
- `NEXT_PUBLIC_SITE_URL`: the public site URL used by metadata and production verification

Optional repository variables:

- `FTP_PROTOCOL`: defaults to `ftps`
- `FTP_PORT`: defaults to `21`
- `NEXT_PUBLIC_BASE_PATH`
- `NEXT_PUBLIC_CV_PDF`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_PROFILE_AVATAR`
- `NEXT_PUBLIC_SOCIAL_IMAGE`
- `NEXT_PUBLIC_FAVICON`
- `NEXT_PUBLIC_GITHUB_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_LINKEDIN_URL`

Push to `production`, or manually run the workflow and select the `production` branch. The job has an additional branch guard, so running it from `master` cannot overwrite production.

## Releases and production verification

Each successful deployment creates a version in the format `v<major>.<minor>.<GitHub run number>`. The major and minor values come from `package.json`.

After upload, the workflow verifies:

- `robots.txt` points to the production sitemap;
- the sitemap contains the blog route;
- the blog page has the expected canonical URL;
- the Open Graph image is reachable;
- the live `version.json` matches the current deployment.

Only after verification succeeds does it create a tag and GitHub Release containing the exact deployed archive and its SHA-256 checksum. The currently deployed version is available at `/version.json`.

## License

Released under the [MIT License](LICENSE).
