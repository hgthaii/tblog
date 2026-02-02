package com.hgthaii.tblog.dto.request;

import com.hgthaii.tblog.domain.Skill;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSkillRequest(
		@NotBlank(message = "Name is required") String name,

		String description,

		String icon,

		@NotNull(message = "Proficiency is required") @Min(value = 1, message = "Proficiency must be at least 1") @Max(value = 100, message = "Proficiency must be at most 100") Integer proficiency,

		@NotNull(message = "Type is required") Skill.SkillType type) {
}
