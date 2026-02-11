package com.hgthaii.tblog.service;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;

import java.util.List;
import java.util.Map;

/**
 * Service interface for Skill management operations.
 */
public interface SkillService {

	/**
	 * Get all skills as DTOs.
	 *
	 * @return list of all skills
	 */
	List<SkillDTO> getAllSkills();

	/**
	 * Get all skills as DTOs (alias for getAllSkills).
	 *
	 * @return list of all skills
	 */
	List<SkillDTO> getAllSkillsAsDTO();

	/**
	 * Get skills grouped by type as DTOs.
	 *
	 * @return map of skill type to list of skills
	 */
	Map<String, List<SkillDTO>> getSkillsGroupedByTypeAsDTO();

	/**
	 * Get skills grouped by type as entities (for Thymeleaf views).
	 *
	 * @return map of skill type to list of skill entities
	 */
	Map<Skill.SkillType, List<Skill>> getSkillsGroupedByType();

	/**
	 * Get a skill by ID as DTO.
	 *
	 * @param id the skill ID
	 * @return SkillDTO
	 */
	SkillDTO getSkillById(Long id);

	/**
	 * Get a skill by ID as DTO (alias for getSkillById).
	 *
	 * @param id the skill ID
	 * @return SkillDTO
	 */
	SkillDTO getSkillByIdAsDTO(Long id);

	/**
	 * Save a skill entity (for Thymeleaf form submission).
	 *
	 * @param skill the skill entity
	 * @return saved skill entity
	 */
	Skill saveSkill(Skill skill);

	/**
	 * Create a new skill.
	 *
	 * @param request the create request
	 * @return created SkillDTO
	 */
	SkillDTO createSkill(CreateSkillRequest request);

	/**
	 * Update an existing skill.
	 *
	 * @param id      the skill ID
	 * @param request the update request
	 * @return updated SkillDTO
	 */
	SkillDTO updateSkill(Long id, UpdateSkillRequest request);

	/**
	 * Delete a skill by ID.
	 *
	 * @param id the skill ID
	 */
	void deleteSkill(Long id);
}
