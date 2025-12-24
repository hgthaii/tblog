package models

import "time"

type Post struct {
	ID        int
	Title     string
	Slug      string
	Content   string // markdown raw
	HTML      string // markdown -> html
	CreatedAt time.Time
	ReadingTime int
}