# tblog

A minimal, atmospheric personal site and Markdown blog built with Next.js. It includes a responsive home page, writing archive, milestone timeline, CV viewer, route metadata, sitemap, custom error pages, and a static cPanel deployment workflow.

The project uses the App Router and static export, so the generated `out/` directory can be hosted without a Node.js server.

## Branch model

- `master` is the public template. It contains sample profile data, Lorem Ipsum milestones, example posts, and placeholder links.
- `dev` is used for feature work before changes are merged into `master` through a pull request.
- Personal content is stored in a separate private repository and is applied only during deployment.

The included workflow deploys directly from `master`, so no long-lived production branch or cherry-pick step is required.

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

## Store personal content privately

Keep real profile data, posts, and personal assets in a separate private repository. The deployment workflow overlays them onto the public template immediately before building. Follow [Private content deployment](docs/private-content.md) to configure both repositories.

## Quality checks

```bash
pnpm lint
pnpm build
```

The static output is written to `out/`.

The `CI` workflow runs the same lint and static-build checks for every pull request targeting `master`. GitHub can require this check before merge through a branch protection rule.

For a subfolder deployment such as `https://example.com/blog/`, use:

```bash
NEXT_PUBLIC_BASE_PATH=/blog pnpm build:path
```

## Automatic cPanel deployment

The workflow in `.github/workflows/deploy.yml` deploys the `master` template with content from a separate private repository. It runs after code reaches `master`, when the content repository sends a `content_updated` event, or when it is started manually. See [Private content deployment](docs/private-content.md) for setup.

Add these repository secrets under **Settings -> Secrets and variables -> Actions**:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)
- `PRIVATE_CONTENT_TOKEN`: a fine-grained token with read-only access to the private content repository

Add these required repository variables:

- `FTP_TARGET_DIR`: for example `public_html/`
- `NEXT_PUBLIC_SITE_URL`: the public site URL used by metadata and production verification
- `PRIVATE_CONTENT_REPOSITORY`: for example `hgthaii/tblog-content`

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

Merge a pull request into `master`, push to the private content repository, or manually run the workflow on `master`.

## Releases and production verification

Each successful deployment creates a version in the format `v<major>.<minor>.<GitHub run number>`. The major and minor values come from `package.json`.

After upload, the workflow verifies:

- `robots.txt` points to the production sitemap;
- the sitemap contains the blog route;
- the blog page has the expected canonical URL;
- the Open Graph image is reachable;
- the live `version.json` matches the current deployment.

Only after verification succeeds does it create a tag and GitHub Release containing the exact deployed archive and its SHA-256 checksum. The currently deployed version is available at `/version.json`.

The release archive is public and contains the final deployed website, including overlaid content. The private repository protects source history and editing workflow, not content that is intentionally published on the website.

## License

Released under the [MIT License](LICENSE).
