# Contributing

Thank you for helping improve tblog.

## Development workflow

1. Fork the repository and create a focused feature branch. Maintainers use `dev` for integration work and open pull requests from `dev` to `master`.
2. Sync the branch with the latest `master` before making changes.
3. Install dependencies with `pnpm install --frozen-lockfile`.
4. Keep user-facing copy in `content/locales/*.json` and preserve the same key structure across locales.
5. Keep personal content, credentials, generated output, and `.env.local` outside the public repository.
6. Run the required checks:

   ```bash
   git diff --check
   pnpm lint
   pnpm audit --prod --audit-level=moderate
   pnpm build
   ```

7. Open a pull request targeting `master` and describe the user-visible effect of the change.

After a squash merge, maintainers must merge or rebase the updated `master` back into `dev` before the next feature. This prevents old workflow or dependency versions from being reintroduced by a later pull request.

## Content and documentation

- Public example content must remain generic, English-first, and safe to publish.
- Private profile data, posts, and assets belong in the separate content repository.
- Update both locale JSON files when adding or removing a locale key.
- Update `README.md`, `docs/project-flow.mmd`, its exported SVG, and `project-structure.txt` when a change makes those documents inaccurate.
- Do not edit the exported SVG by hand; regenerate it from the Mermaid source.

## Pull request checklist

- The change is focused and does not include unrelated formatting or dependency updates.
- Required checks pass locally.
- No secret, `.env.local`, private post, or personal asset is tracked.
- Public and private deployment behavior remains separated.
- User-facing or operational changes are documented.

Keep pull requests small enough to review and avoid unrelated formatting or dependency changes.
