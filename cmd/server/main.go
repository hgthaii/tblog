package main

import (
	"log"
	"net/http"
	"tblog/internal/handlers"
)

func main() {
	http.HandleFunc("/", handlers.Home)

	http.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("static")),
		),
	)

	log.Println("🚀 Server running at http://localhost:8888")
	http.ListenAndServe(":8888", nil)
}