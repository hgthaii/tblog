package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

const dbPath = "./data/posts.db"

type Post struct {
    ID        string `json:"id"`
    Slug      string `json:"slug"`
    Title     string `json:"title"`
    Excerpt   string `json:"excerpt,omitempty"`
    Content   string `json:"content,omitempty"`
    CreatedAt string `json:"created_at"`
    UpdatedAt string `json:"updated_at"`
}

func main() {
    // Ensure data dir exists
    os.MkdirAll("./data", 0755)

    db, err := sql.Open("sqlite3", dbPath)
    if err != nil {
        panic(err)
    }
    defer db.Close()

    if err := migrate(db); err != nil {
        panic(err)
    }

    // If empty, seed from existing markdown files under ../src/data/markdown
    if empty, _ := isPostsEmpty(db); empty {
        seedFromMarkdown(db, "../src/data/markdown")
    }

    r := gin.Default()

    // Serve static frontend from ../src under /static to avoid routing conflicts with /api
    // Serve index at root, and assets under /static
    r.Static("/static", "../src")
    r.GET("/", func(c *gin.Context) {
        c.File("../index.html")
    })
    // Admin page
    r.GET("/admin", func(c *gin.Context) {
        c.File("../src/admin.html")
    })
    // For SPA-style routes (not starting with /api), serve index.html
    r.NoRoute(func(c *gin.Context) {
        path := c.Request.URL.Path
        if len(path) >= 4 && path[:4] == "/api" {
            c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
            return
        }
        c.File("../index.html")
    })

    api := r.Group("/api")
    {
        api.GET("/posts", func(c *gin.Context) { listPostsHandler(c, db) })
        api.GET("/posts/:slug", func(c *gin.Context) { getPostHandler(c, db) })
        api.POST("/posts", func(c *gin.Context) { createPostHandler(c, db) })
        api.PUT("/posts/:slug", func(c *gin.Context) { updatePostHandler(c, db) })
        api.DELETE("/posts/:slug", func(c *gin.Context) { deletePostHandler(c, db) })
    }

    fmt.Println("Server running at http://localhost:8888")
    r.Run(":8888")
}

func migrate(db *sql.DB) error {
    schema := `CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE,
        title TEXT,
        content TEXT,
        created_at DATETIME,
        updated_at DATETIME
    );`
    _, err := db.Exec(schema)
    return err
}

func isPostsEmpty(db *sql.DB) (bool, error) {
    var count int
    err := db.QueryRow("SELECT COUNT(1) FROM posts").Scan(&count)
    if err != nil {
        return false, err
    }
    return count == 0, nil
}

func seedFromMarkdown(db *sql.DB, mdDir string) {
    files, err := ioutil.ReadDir(mdDir)
    if err != nil {
        fmt.Println("Không thể đọc thư mục markdown:", err)
        return
    }
    for _, f := range files {
        if f.IsDir() || filepath.Ext(f.Name()) != ".md" {
            continue
        }
        slug := f.Name()[0 : len(f.Name())-len(filepath.Ext(f.Name()))]
        data, _ := ioutil.ReadFile(filepath.Join(mdDir, f.Name()))
        now := time.Now().Format(time.RFC3339)
        p := Post{
            ID:        uuid.New().String(),
            Slug:      slug,
            Title:     slug,
            Content:   string(data),
            CreatedAt: now,
            UpdatedAt: now,
        }
        insertPost(db, &p)
    }
}

func insertPost(db *sql.DB, p *Post) error {
    _, err := db.Exec("INSERT OR IGNORE INTO posts(id,slug,title,content,created_at,updated_at) VALUES(?,?,?,?,?,?)",
        p.ID, p.Slug, p.Title, p.Content, p.CreatedAt, p.UpdatedAt)
    return err
}

func listPostsHandler(c *gin.Context, db *sql.DB) {
    // Return a short excerpt for listing (first 240 chars of content)
    rows, err := db.Query("SELECT id,slug,title,substr(content,1,240) as excerpt,created_at,updated_at FROM posts ORDER BY created_at DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()
    posts := []Post{}
    for rows.Next() {
        var p Post
        if err := rows.Scan(&p.ID, &p.Slug, &p.Title, &p.Excerpt, &p.CreatedAt, &p.UpdatedAt); err != nil {
            continue
        }
        posts = append(posts, p)
    }
    c.JSON(http.StatusOK, posts)
}

func getPostHandler(c *gin.Context, db *sql.DB) {
    slug := c.Param("slug")
    var p Post
    row := db.QueryRow("SELECT id,slug,title,content,created_at,updated_at FROM posts WHERE slug = ?", slug)
    if err := row.Scan(&p.ID, &p.Slug, &p.Title, &p.Content, &p.CreatedAt, &p.UpdatedAt); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }
    c.JSON(http.StatusOK, p)
}

func createPostHandler(c *gin.Context, db *sql.DB) {
    var p Post
    if err := c.BindJSON(&p); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if p.ID == "" {
        p.ID = uuid.New().String()
    }
    if p.Slug == "" {
        p.Slug = p.ID
    }
    now := time.Now().Format(time.RFC3339)
    p.CreatedAt = now
    p.UpdatedAt = now
    if err := insertPost(db, &p); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, p)
}

func updatePostHandler(c *gin.Context, db *sql.DB) {
    slug := c.Param("slug")
    var p Post
    if err := c.BindJSON(&p); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    now := time.Now().Format(time.RFC3339)
    p.UpdatedAt = now
    // update by slug
    res, err := db.Exec("UPDATE posts SET title=?, content=?, updated_at=? WHERE slug=?", p.Title, p.Content, p.UpdatedAt, slug)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    if n, _ := res.RowsAffected(); n == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}

func deletePostHandler(c *gin.Context, db *sql.DB) {
    slug := c.Param("slug")
    res, err := db.Exec("DELETE FROM posts WHERE slug = ?", slug)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    if n, _ := res.RowsAffected(); n == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}
