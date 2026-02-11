package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;
import com.hgthaii.tblog.exception.ResourceNotFoundException;
import com.hgthaii.tblog.mapper.SkillMapper;
import com.hgthaii.tblog.repository.SkillRepository;
import com.hgthaii.tblog.service.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of SkillService.
 * Refactored to use SkillMapper for DTO conversions.
 */
@Service
@Transactional
public class SkillServiceImpl implements SkillService {

	private final SkillRepository skillRepository;
	private final SkillMapper skillMapper;

	public SkillServiceImpl(SkillRepository skillRepository, SkillMapper skillMapper) {
		this.skillRepository = skillRepository;
		this.skillMapper = skillMapper;
	}

	@Override
	@Transactional(readOnly = true)
	public List<SkillDTO> getAllSkills() {
		return skillRepository.findAll().stream()
				.map(skillMapper::toDTO)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<SkillDTO> getAllSkillsAsDTO() {
		return getAllSkills();
	}

	@Override
	@Transactional(readOnly = true)
	public Map<String, List<SkillDTO>> getSkillsGroupedByTypeAsDTO() {
		return skillRepository.findAll().stream()
				.map(skillMapper::toDTO)
				.collect(Collectors.groupingBy(SkillDTO::type));
	}

	@Override
	@Transactional(readOnly = true)
	public Map<Skill.SkillType, List<Skill>> getSkillsGroupedByType() {
		return skillRepository.findAll().stream()
				.collect(Collectors.groupingBy(Skill::getType));
	}

	@Override
	@Transactional(readOnly = true)
	public SkillDTO getSkillById(Long id) {
		Skill skill = skillRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
		return skillMapper.toDTO(skill);
	}

	@Override
	@Transactional(readOnly = true)
	public SkillDTO getSkillByIdAsDTO(Long id) {
		return getSkillById(id);
	}

	@Override
	public Skill saveSkill(Skill skill) {
		return skillRepository.save(skill);
	}

	@Override
	public SkillDTO createSkill(CreateSkillRequest request) {
		Skill skill = skillMapper.toEntity(request);
		Skill saved = skillRepository.save(skill);
		return skillMapper.toDTO(saved);
	}

	@Override
	public SkillDTO updateSkill(Long id, UpdateSkillRequest request) {
		Skill skill = skillRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

		skillMapper.updateEntity(skill, request);
		Skill saved = skillRepository.save(skill);
		return skillMapper.toDTO(saved);
	}

	@Override
	public void deleteSkill(Long id) {
		if (!skillRepository.existsById(id)) {
			throw new ResourceNotFoundException("Skill not found with id: " + id);
		}
		skillRepository.deleteById(id);
	}
}
