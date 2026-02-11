package com.hgthaii.tblog.mapper.impl;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;
import com.hgthaii.tblog.mapper.SkillMapper;
import org.springframework.stereotype.Component;

/**
 * Implementation of SkillMapper.
 * Handles all Skill entity-DTO conversions.
 */
@Component
public class SkillMapperImpl implements SkillMapper {

	@Override
	public SkillDTO toDTO(Skill skill) {
		return new SkillDTO(
				skill.getId(),
				skill.getName(),
				skill.getDescription(),
				skill.getIcon(),
				skill.getProficiency(),
				skill.getType().name());
	}

	@Override
	public Skill toEntity(CreateSkillRequest request) {
		return Skill.builder()
				.name(request.name())
				.description(request.description())
				.icon(request.icon())
				.proficiency(request.proficiency())
				.type(request.type())
				.build();
	}

	@Override
	public void updateEntity(Skill skill, UpdateSkillRequest request) {
		if (request.name() != null) {
			skill.setName(request.name());
		}
		if (request.description() != null) {
			skill.setDescription(request.description());
		}
		if (request.icon() != null) {
			skill.setIcon(request.icon());
		}
		if (request.proficiency() != null) {
			skill.setProficiency(request.proficiency());
		}
		if (request.type() != null) {
			skill.setType(request.type());
		}
	}
}
