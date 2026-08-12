# Security Policy

## Supported versions

Security fixes are applied to the current `master` branch and the latest published release. Older releases are not maintained.

## Reporting a vulnerability

Please do not report security vulnerabilities through public issues.

Use the repository's private vulnerability reporting form under **Security → Advisories → Report a vulnerability**. Include the affected version, reproduction steps, expected impact, and any suggested mitigation.

Maintainers will acknowledge a complete report as soon as practical and coordinate disclosure after a fix is available.

## Sensitive data

Never commit access tokens, FTP credentials, Telegram credentials, `.env.local`, private posts, or personal assets to this public repository. Use GitHub Actions secrets for credentials and repository variables for non-secret deployment configuration.

The separate private content repository protects editing history and source access only. Any content or asset overlaid into the generated site, release archive, or cPanel deployment becomes publicly accessible.

## Dependency updates

Dependency and GitHub Actions updates must pass the repository CI workflow before merge. Major upgrades should be reviewed separately instead of being grouped with unrelated updates.
