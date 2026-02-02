package com.hgthaii.tblog.dto;

import java.time.LocalDateTime;

public record PostDTO(
		Long id,
		String title,
		String slug,
		String excerpt,
		LocalDateTime createdAt,
		String authorName,
		String categoryName) {
}
