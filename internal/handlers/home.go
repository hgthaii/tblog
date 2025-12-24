package handlers

import (
	"html/template"
	"net/http"
	"strings"
	"time"

	"tblog/internal/db"
	"tblog/internal/models"
)

func readingTime(md string) int {
	words := len(strings.Fields(md))
	min := words / 200
	if min < 1 {
		return 1
	}
	return min
}

func excerpt(md string) string {
	text := strings.ReplaceAll(md, "\n", " ")
	words := strings.Fields(text)

	if len(words) > 40 {
		return strings.Join(words[:40], " ") + "..."
	}
	return strings.Join(words, " ")
}

func Home(w http.ResponseWriter, r *http.Request) {
	conn, err := db.Open()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer conn.Close()

	rows, err := conn.Query(`
		SELECT id, title, slug, content, created_at
		FROM posts
		ORDER BY created_at DESC
	`)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var created string

		if err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Slug,
			&p.Content,
			&created,
		); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		p.CreatedAt, _ = time.Parse(time.RFC3339, created)
		p.ReadingTime = readingTime(p.Content)
		p.Content = excerpt(p.Content)

		posts = append(posts, p)
	}

	tmpl := template.Must(template.ParseFiles(
		"templates/layouts/base.html",
		"templates/pages/home.html",
	))

	tmpl.Execute(w, posts)
}
