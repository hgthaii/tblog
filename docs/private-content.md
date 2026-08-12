# Private content deployment

The public `tblog` repository contains the reusable English template. Personal content lives in a separate private repository and is overlaid immediately before the static build.

The private overlay is used only by the cPanel production workflow. The GitHub Pages workflow always builds the public English example content tracked in `tblog` and never checks out the private repository.

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

The `public/` directory is optional. Do not store FTP credentials, Telegram tokens, personal access tokens, or other secrets in this repository. Files placed here become public after they are overlaid into the deployed site and release archive.

Set the public repository variable `NEXT_PUBLIC_LOCALE` to `vi` when the private locale is Vietnamese. The English locale remains available from the template, while private posts replace all sample posts during deployment.

## Allow tblog to read private content

Create a fine-grained personal access token with access to only the private content repository and grant `Contents: Read-only`.

In the public `tblog` repository, add:

- Actions secret `PRIVATE_CONTENT_TOKEN`: the read-only token.
- Actions variable `PRIVATE_CONTENT_REPOSITORY`: for example `your-username/tblog-content`.
- Actions variable `DEPLOY_ENABLED`: set it to `true` only after the cPanel and content settings are complete.
- Actions variable `NEXT_PUBLIC_LOCALE`: set it to the locale supplied by the private repository, for example `vi`.

## Trigger deployment from the private repository

Create a second fine-grained personal access token with access to only the public `tblog` repository and grant `Contents: Read and write`. GitHub requires write-level Contents permission to create a repository dispatch event.

In the private content repository, add the token as the Actions secret `TBLOG_DISPATCH_TOKEN`, add `TBLOG_REPOSITORY` as an Actions variable using `owner/repository` format, then copy [`trigger-tblog-deploy.yml`](content-repository/trigger-tblog-deploy.yml) to `.github/workflows/trigger-tblog-deploy.yml`.

Every push to the private repository's `master` branch will send the exact content commit SHA to `tblog`. The public deployment workflow checks out `master`, overlays that content revision, builds, verifies production, creates a release, and sends the Telegram notification.

The dispatch token belongs only in the private content repository. The read-only content token belongs only in the public template repository; the two tokens serve different directions and should not be reused.

## Deployment flow

```text
Code:           dev -> pull request -> tblog/master
Public demo:    tblog/master -> public build -> GitHub Pages
Production:     tblog/master + tblog-content revision -> private overlay -> cPanel
Content update: tblog-content/master -> repository dispatch -> production deploy
```

The deployed `/version.json` contains both the public code commit and the private content commit.

## Troubleshooting

- **The content workflow exits before `curl`:** verify `TBLOG_DISPATCH_TOKEN` and `TBLOG_REPOSITORY` exist in the private repository.
- **The dispatch returns `404` or `403`:** confirm the fine-grained token can access the public repository and has `Contents: Read and write`.
- **The cPanel deploy is skipped:** set `DEPLOY_ENABLED=true` in the public repository variables.
- **The private checkout fails:** confirm `PRIVATE_CONTENT_REPOSITORY` uses `owner/repository` format and `PRIVATE_CONTENT_TOKEN` has read access to that exact repository.
- **A locale file is missing:** make sure `NEXT_PUBLIC_LOCALE` matches a JSON filename under `content/locales/` in the private repository.
- **The deployed content is stale:** compare the `contentCommit` in `/version.json` with the commit SHA that triggered the private repository workflow.
