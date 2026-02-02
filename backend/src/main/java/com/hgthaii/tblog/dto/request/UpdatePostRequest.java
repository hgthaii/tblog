package com.hgthaii.tblog.dto.request;

public record UpdatePostRequest(
		String title,
		String slug,
		String content,
		String authorName,
		String categorySlug,
		String tags) {
}
