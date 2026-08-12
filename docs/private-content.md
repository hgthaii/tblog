# Private content deployment

The public `tblog` repository contains the reusable English template. Personal content lives in a separate private repository and is overlaid immediately before the static build.

## Private repository layout

Create a private repository such as `your-username/tblog-content` with this structure:

```text
content/
├── locales/
│   └── vi.json
└── posts/
    └── 2026-01-01-example.md
public/
├── profile.jpg
└── og-image.png
```

The `public/` directory is optional. Do not store FTP credentials, Telegram tokens, personal access tokens, or other secrets in this repository.

Set the public repository variable `NEXT_PUBLIC_LOCALE` to `vi` when the private locale is Vietnamese. The English locale remains available from the template, while private posts replace all sample posts during deployment.

## Allow tblog to read private content

Create a fine-grained personal access token with access to only the private content repository and grant `Contents: Read-only`.

In the public `tblog` repository, add:

- Actions secret `PRIVATE_CONTENT_TOKEN`: the read-only token.
- Actions variable `PRIVATE_CONTENT_REPOSITORY`: for example `your-username/tblog-content`.

## Trigger deployment from the private repository

Create a second fine-grained personal access token with access to only the public `tblog` repository and grant `Contents: Read and write`. GitHub requires write-level Contents permission to create a repository dispatch event.

In the private content repository, add the token as the Actions secret `TBLOG_DISPATCH_TOKEN`, add `TBLOG_REPOSITORY` as an Actions variable using `owner/repository` format, then copy [`trigger-tblog-deploy.yml`](content-repository/trigger-tblog-deploy.yml) to `.github/workflows/trigger-tblog-deploy.yml`.

Every push to the private repository's `master` branch will send the exact content commit SHA to `tblog`. The public deployment workflow checks out `master`, overlays that content revision, builds, verifies production, creates a release, and sends the Telegram notification.

## Deployment flow

```text
Code:    dev -> pull request -> tblog/master -> deploy
Content: tblog-content/master -> repository dispatch -> deploy
```

The deployed `/version.json` contains both the public code commit and the private content commit.
