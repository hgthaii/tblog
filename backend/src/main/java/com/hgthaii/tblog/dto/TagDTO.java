package com.hgthaii.tblog.dto;

import com.hgthaii.tblog.domain.Tag;

public record TagDTO(
		Long id,
		String name,
		String slug) {
	public static TagDTO fromEntity(Tag tag) {
		if (tag == null)
			return null;
		return new TagDTO(
				tag.getId(),
				tag.getName(),
				tag.getSlug());
	}
}
