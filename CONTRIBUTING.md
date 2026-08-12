# Contributing

Thank you for helping improve tblog.

## Development workflow

1. Fork the repository and create a focused feature branch.
2. Install dependencies with `pnpm install --frozen-lockfile`.
3. Keep user-facing copy in `content/locales/*.json` and preserve the same key structure across locales.
4. Keep personal content, credentials, and `.env.local` outside the public repository.
5. Run the required checks:

   ```bash
   pnpm lint
   pnpm build
   pnpm audit --prod
   git diff --check
   ```

6. Open a pull request targeting `master` and describe the user-visible effect of the change.

Keep pull requests small enough to review and avoid unrelated formatting or dependency changes.
