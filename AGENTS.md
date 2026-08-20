# tblog agent instructions

These instructions apply to the entire repository. Read them before starting work and use the execution gate before every tool call, command, or edit.

## Repository contract

- This is a single-repository personal Next.js site. Application code, publishable content, and public assets live together.
- Preserve the App Router, static export, pnpm, Vietnamese default locale, and cPanel deployment structure unless the user explicitly requests a migration.
- Treat the working tree as shared. Preserve modified and untracked files; never discard, overwrite, stage, or commit unrelated work.
- Files under `content/` and `public/` are publishable. Never copy `.env.local`, credentials, private drafts, or material that must remain secret into tracked files.
- Do not read or print secret values from `.env.local`; inspecting variable names without values is acceptable.
- Do not commit, push, publish, deploy, create releases, change GitHub settings, rewrite branch history, or archive another repository unless the user explicitly requests that exact action.

## Execution gate

Before every action, silently check:

1. **Scope:** Is it necessary for the current request?
2. **Authority:** Is it read-only, or is the mutation authorized?
3. **Target:** Are the exact files, process, branch, and environment known?
4. **Preservation:** Could it overwrite user work, content, generated artifacts, or secrets?
5. **Smallest action:** Is there a narrower, reversible action?
6. **Expectation:** What proves success, and how is code failure distinguished from an environment limitation?

If a missing choice materially changes the result, ask. Otherwise state a reasonable assumption and use the smallest implementation.

## Working rules

- Start implementation with `git status --short` and inspect relevant files.
- Before implementing a feature, read the nearest README, relevant `docs/`, configuration examples, workflow docs, and the applicable guides under `node_modules/next/dist/docs/`.
- When behavior, setup, configuration, commands, deployment, or operations change, update the nearest documentation in the same task.
- Use `rg` for searches and `apply_patch` for manual edits.
- Keep changes focused; do not reorganize, rename, upgrade, or clean unrelated code opportunistically.
- Keep `content/locales/en.json` and `content/locales/vi.json` type-compatible.
- For Open Graph and SEO, keep Home as `<profile name> - <site title>` and non-Home routes as the page or post title only. Use `app/lib/opengraph.tsx` and verify metadata plus one rendered image.
- Use Conventional Commits. `feat`, `fix`, `perf`, `content`, and breaking changes may create a release; routine docs, chore, CI, style, test, and refactor commits do not.
- Prefer merge commits for `dev` to `master`; do not squash or rewrite history without explicit approval.
- Treat command failures literally and separate code problems from missing configuration, network, permissions, ports, or sandbox limits.

## Validation matrix

- Docs/instructions only: `git diff --check` and inspect the rendered source diff.
- TypeScript, React, config, styling, or content: `git diff --check`, `pnpm lint`, and `pnpm build`.
- Deployment workflow: inspect the exact YAML diff and ensure README claims match it. Never trigger production unless explicitly requested.
- Open Graph: after building, inspect `out/**/opengraph-image` plus generated `title`, `og:title`, and `og:image` metadata.

Do not claim a check passed unless it completed successfully in the current task.

## Completion gate

1. Re-read the latest request and confirm every outcome is addressed.
2. Run `git diff --check` and review `git status --short`.
3. Review the focused diff for secrets, private drafts, debug output, generated files, and unrelated changes.
4. Re-read relevant docs and update any stale contract.
5. Summarize changed files, validation evidence, preserved work, and remaining remote action or blocker.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
