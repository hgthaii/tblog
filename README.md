# tblog

Personal site and Markdown blog built with Next.js App Router and static export. The same repository now owns the application, Vietnamese content, posts, public assets, cPanel deployment, and releases.

![tblog project flow](docs/assets/project-flow.svg)

## Requirements

- Node.js 22.14 or newer
- pnpm 10.25.0

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Content changes under `content/` and asset changes under `public/` use the normal Next.js development reload; there is no private overlay or second repository.

The production build is a static site in `out/`:

```bash
git diff --check
pnpm lint
pnpm audit --prod --audit-level=moderate
pnpm build
```

For a subfolder deployment, set a base path explicitly:

```bash
NEXT_PUBLIC_BASE_PATH=/blog pnpm build:path
```

## Content

- `content/locales/vi.json` contains the published profile, navigation, milestones, CV, SEO, error, and accessibility copy.
- `content/locales/en.json` remains the type-compatible English locale.
- `content/posts/*.md` contains published posts. The filename becomes the route slug.
- `public/` contains the avatar, CV, social image, icons, and other public assets.

A post uses this frontmatter:

```md
---
title: "Tên bài viết"
createdAt: "21/08/2026"
authorName: "Tên tác giả"
category: "ghi chú, cá nhân"
quote: "Một câu ngắn đại diện cho bài viết."
order: 1
---

Nội dung bài viết.
```

`title` and `createdAt` are required. Dates accept `DD/MM/YYYY`, `YYYY-MM-DD`, or an ISO datetime and must be real calendar dates. `authorName`, `category`, `quote`, and `order` are optional. Every build validates frontmatter and duplicate slugs before generating pages.

The post `quote` is the main Open Graph text. Without a quote, the renderer falls back to the post title. Other routes use the current page title. The shared renderer lives in `app/lib/opengraph.tsx`. Home keeps `thái. - một vài âm điệu từ tôi`; other document and social titles stay concise with only the page or post title.

## Configuration

Copy `.env.example` to `.env.local` for local development. Public build-time values use `NEXT_PUBLIC_*` because the result is static; never put credentials in those variables.

Important values:

- `NEXT_PUBLIC_SITE_URL`: canonical production origin.
- `NEXT_PUBLIC_LOCALE`: defaults to `vi`.
- `NEXT_PUBLIC_CV_PDF`, `NEXT_PUBLIC_CONTACT_EMAIL`, and social URLs.
- `NEXT_PUBLIC_PROFILE_AVATAR`: defaults to `/hgthaii.jpg`.
- `NEXT_PUBLIC_PROFILE_AVATAR_FIT`, `NEXT_PUBLIC_PROFILE_AVATAR_POSITION`, and `NEXT_PUBLIC_PROFILE_AVATAR_SCALE`: adjust any avatar without changing CSS.
- `NEXT_PUBLIC_TRACKING_SRC` and `NEXT_PUBLIC_TRACKING_WEBSITE_ID`: enable Umami only when both are set.
- `NEXT_PUBLIC_SEASONAL_THEME`: `auto`, `none`, a supported celebration, or a season.

In `auto`, celebration themes are active only during the seven calendar days ending on the event date in `Asia/Ho_Chi_Minh`. The supported celebrations are New Year, Lunar New Year, Reunification Day/Labour Day, International Children's Day, National Day, Mid-Autumn Festival, and Christmas. Outside those windows, the site uses its spring, summer, autumn, or winter scene. Decorations remain fixed outside route transitions and respect reduced-motion preferences.

## Branch and merge model

- `dev` is the integration branch.
- Changes reach `master` through a pull request after CI passes.
- Merge the PR with a **merge commit**. Disable squash merging in GitHub repository settings so commits already integrated into `master` do not reappear in the next PR.
- After merging, merge `master` back into `dev` before starting the next batch of work.

Use Conventional Commits because release automation reads commit intent:

```text
feat(scope): add user-visible capability
fix(scope): correct user-visible behavior
perf(scope): improve runtime performance
content(posts): publish a post
docs(scope): update documentation
chore(scope): maintain tooling
```

Breaking changes use `!` or a `BREAKING CHANGE:` footer.

## CI, deployment, and releases

`.github/workflows/ci.yml` checks pull requests targeting `master` with whitespace validation, lint, production dependency audit, and a static build.

`.github/workflows/deploy.yml` builds the content tracked in this repository and deploys `master` to cPanel when `DEPLOY_ENABLED=true`. It uploads immutable assets first, pages and metadata last, then verifies the live sitemap, canonical URL, Open Graph image, and deployed commit in `/version.json`.

Required GitHub Actions secrets:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

Optional notification secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Required repository variables:

- `DEPLOY_ENABLED=true`
- `FTP_TARGET_DIR`, for example `public_html/`
- `NEXT_PUBLIC_SITE_URL`

Optional variables mirror `.env.example`; `FTP_PROTOCOL` defaults to `ftps` and `FTP_PORT` defaults to `21`.

Every successful qualifying `master` deployment runs semantic-release after production verification:

- `feat` creates a minor release.
- `fix`, `perf`, and `content` create a patch release.
- a breaking change creates a major release.
- `docs`, `chore`, `ci`, `style`, `test`, and ordinary `refactor` commits deploy when their changed paths require it but do not create a tag.

When a release is required, GitHub receives a SemVer tag, generated notes, the exact static archive, and its SHA-256 checksum. If no commit requires a release, deployment completes without creating a tag. The package version in `package.json` is not manually bumped.

## Repository map

- [Agent instructions](AGENTS.md): execution and completion checklist.
- [Project flow source](docs/project-flow.mmd): editable Mermaid source for the diagram.
- [Project structure](project-structure.txt): maintained source tree overview.
- [Contributing](CONTRIBUTING.md): branch, commit, and pull request rules.
- [Security policy](SECURITY.md): reporting and secret-handling rules.

Released under the [MIT License](LICENSE).
