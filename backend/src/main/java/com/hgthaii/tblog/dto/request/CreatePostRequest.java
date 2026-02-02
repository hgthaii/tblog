package com.hgthaii.tblog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
		@NotBlank(message = "Title is required") @Size(max = 255) String title,

		@NotBlank(message = "Slug is required") @Size(max = 255) String slug,

		@NotBlank(message = "Content is required") String content,

		String authorName,

		String categorySlug,

		String tags // Comma-separated tags
) {
}
