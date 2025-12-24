package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"tblog/internal/db"
)

func main() {
	conn, err := db.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	dir := "seed/posts"

	files, err := os.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
	}

	for _, f := range files {
		if f.IsDir() || !strings.HasSuffix(f.Name(), ".md") {
			continue
		}

		path := filepath.Join(dir, f.Name())
		content, err := os.ReadFile(path)
		if err != nil {
			log.Fatal(err)
		}

		slug := strings.TrimSuffix(f.Name(), ".md")
		title := strings.ReplaceAll(slug, "-", " ")

		_, err = conn.Exec(`
			INSERT OR IGNORE INTO posts (title, slug, content)
			VALUES (?, ?, ?)
		`, title, slug, string(content))

		if err != nil {
			log.Fatal(err)
		}

		log.Println("✔ Seeded:", slug)
	}

	log.Println("✅ Seed xong toàn bộ markdown")
}
