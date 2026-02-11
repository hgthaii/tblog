package com.hgthaii.tblog.mapper;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;

/**
 * Mapper interface for Skill entity and DTO conversions.
 */
public interface SkillMapper {

	/**
	 * Convert Skill entity to SkillDTO.
	 *
	 * @param skill the skill entity
	 * @return SkillDTO
	 */
	SkillDTO toDTO(Skill skill);

	/**
	 * Convert CreateSkillRequest to Skill entity.
	 *
	 * @param request the create request
	 * @return new Skill entity
	 */
	Skill toEntity(CreateSkillRequest request);

	/**
	 * Update existing Skill entity from UpdateSkillRequest.
	 *
	 * @param skill   the existing skill entity
	 * @param request the update request
	 */
	void updateEntity(Skill skill, UpdateSkillRequest request);
}
