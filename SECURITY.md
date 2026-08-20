# Security Policy

## Supported version

Security fixes apply to the current `master` branch and latest published release. Older releases are not maintained.

## Reporting a vulnerability

Do not report vulnerabilities through public issues. Use **Security → Advisories → Report a vulnerability** and include the affected version, reproduction steps, expected impact, and any suggested mitigation.

## Sensitive data

Never commit access tokens, FTP credentials, Telegram credentials, `.env.local`, private drafts, or anything that must remain confidential. Store credentials as GitHub Actions secrets and non-secret deployment configuration as repository variables.

This repository intentionally tracks content and assets published by the site. A public repository, static output, and release archive expose those source files and their history; only material intended for publication belongs in tracked paths.

Dependency and GitHub Actions updates must pass CI before merge. Review major upgrades separately from unrelated feature work.
