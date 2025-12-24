package handlers

import (
	"html/template"
	"net/http"
	"strings"
	"tblog/internal/db"
	"tblog/internal/models"
	"tblog/internal/services"
)

func Post(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/posts/")

	conn, _ := db.Open()
	row := conn.QueryRow(`SELECT title, content FROM posts WHERE slug = ?`, slug)

	var p models.Post
	row.Scan(&p.Title, &p.Content)

	html, _ := services.Render(p.Content)
	p.HTML = html

	tmpl := template.Must(template.ParseFiles(
		"templates/layouts/base.html",
		"templates/pages/post.html",
	))

	tmpl.Execute(w, p)
}