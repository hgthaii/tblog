package services

import (
	"bytes"

	"github.com/yuin/goldmark"
)

func Render(md string) (string, error) {
	var buf bytes.Buffer
	err := goldmark.Convert([]byte(md), &buf)

	return buf.String(), err
}
