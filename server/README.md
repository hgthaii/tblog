# tlog Go server

This small Go server serves the static frontend (`../src`) and provides a simple SQLite-backed CRUD API for blog posts.

Quick start (macOS):

1. Change to server dir:

```bash
cd tlog/server
```

2. Run the server (uses Go 1.20+):

```bash
go run main.go
```

3. Open http://localhost:8080 in your browser.

Notes:

- On first run the server seeds posts from `../src/data/markdown/*.md` into `./data/posts.db`.
- The API endpoints are under `/api/posts`.
