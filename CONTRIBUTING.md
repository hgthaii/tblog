# Contributing

This is a personal site rather than a reusable template. Changes should preserve its current App Router, static export, pnpm, locale, and cPanel deployment structure unless a migration is explicitly planned.

## Workflow

1. Start from the latest `dev` and create a focused branch when useful.
2. Read the source documentation closest to the feature before implementing it.
3. Keep published copy in `content/locales/*.json`, posts in `content/posts/`, and public assets in `public/`.
4. Use Conventional Commits. `feat`, `fix`, `perf`, `content`, and breaking changes control automated releases.
5. Run:

   ```bash
   git diff --check
   pnpm lint
   pnpm audit --prod --audit-level=moderate
   pnpm build
   ```

6. Open a pull request from `dev` to `master` and wait for CI.
7. Use a merge commit, not squash merge. Merge `master` back into `dev` after the PR lands.

## Pull request checklist

- The change is focused and preserves unrelated work.
- Relevant setup, usage, configuration, and operational docs match the implementation.
- Locale files remain type-compatible when keys change.
- No `.env.local`, credential, draft, or material that must stay private is tracked.
- Required checks pass locally.
- Deployment workflow changes have been reviewed without triggering production manually.

Do not edit `docs/assets/project-flow.svg` by hand; regenerate it from `docs/project-flow.mmd`.
