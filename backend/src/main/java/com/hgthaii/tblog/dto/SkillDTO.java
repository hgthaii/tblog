package com.hgthaii.tblog.dto;

import com.hgthaii.tblog.domain.Skill;

public record SkillDTO(
		Long id,
		String name,
		String description,
		String icon,
		Integer proficiency,
		String type) {
	public static SkillDTO fromEntity(Skill skill) {
		return new SkillDTO(
				skill.getId(),
				skill.getName(),
				skill.getDescription(),
				skill.getIcon(),
				skill.getProficiency(),
				skill.getType() != null ? skill.getType().name() : null);
	}
}
