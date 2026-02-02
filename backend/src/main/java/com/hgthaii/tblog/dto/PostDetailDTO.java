package com.hgthaii.tblog.dto;

import java.time.LocalDateTime;

public record PostDetailDTO(
		Long id,
		String title,
		String slug,
		String content,
		String html,
		LocalDateTime createdAt,
		String authorName,
		String categoryName,
		Integer views) {
}
