package com.hgthaii.tblog.dto.request;

import com.hgthaii.tblog.domain.Skill;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record UpdateSkillRequest(
		String name,
		String description,
		String icon,

		@Min(value = 1, message = "Proficiency must be at least 1") @Max(value = 100, message = "Proficiency must be at most 100") Integer proficiency,

		Skill.SkillType type) {
}
