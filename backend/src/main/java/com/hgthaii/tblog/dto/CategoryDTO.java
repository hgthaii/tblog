package com.hgthaii.tblog.dto;

import com.hgthaii.tblog.domain.Category;

public record CategoryDTO(
		Long id,
		String name,
		String slug) {
	public static CategoryDTO fromEntity(Category category) {
		if (category == null)
			return null;
		return new CategoryDTO(
				category.getId(),
				category.getName(),
				category.getSlug());
	}
}
