package com.hgthaii.tblog.service;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;

import java.util.List;
import java.util.Map;

public interface SkillService {
	List<Skill> getAllSkills();

	List<SkillDTO> getAllSkillsAsDTO();

	// Returns skills grouped by type (Language, Framework, etc.)
	Map<Skill.SkillType, List<Skill>> getSkillsGroupedByType();

	Map<String, List<SkillDTO>> getSkillsGroupedByTypeAsDTO();

	SkillDTO getSkillByIdAsDTO(Long id);

	Skill saveSkill(Skill skill);

	SkillDTO createSkill(CreateSkillRequest request);

	SkillDTO updateSkill(Long id, UpdateSkillRequest request);

	void deleteSkill(Long id);
}
