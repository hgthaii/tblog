package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.repository.SkillRepository;
import com.hgthaii.tblog.service.SkillService;
import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;
import com.hgthaii.tblog.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SkillServiceImpl implements SkillService {

	private final SkillRepository skillRepository;

	public SkillServiceImpl(SkillRepository skillRepository) {
		this.skillRepository = skillRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Skill> getAllSkills() {
		return skillRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public List<SkillDTO> getAllSkillsAsDTO() {
		return skillRepository.findAll().stream()
				.map(SkillDTO::fromEntity)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public Map<Skill.SkillType, List<Skill>> getSkillsGroupedByType() {
		return getAllSkills().stream()
				.collect(Collectors.groupingBy(Skill::getType));
	}

	@Override
	@Transactional(readOnly = true)
	public Map<String, List<SkillDTO>> getSkillsGroupedByTypeAsDTO() {
		return getAllSkills().stream()
				.map(SkillDTO::fromEntity)
				.collect(Collectors.groupingBy(SkillDTO::type));
	}

	@Override
	@Transactional(readOnly = true)
	public SkillDTO getSkillByIdAsDTO(Long id) {
		return skillRepository.findById(id)
				.map(SkillDTO::fromEntity)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
	}

	@Override
	public Skill saveSkill(Skill skill) {
		return skillRepository.save(skill);
	}

	@Override
	public SkillDTO createSkill(CreateSkillRequest request) {
		Skill skill = new Skill();
		skill.setName(request.name());
		skill.setDescription(request.description());
		skill.setIcon(request.icon());
		skill.setProficiency(request.proficiency());
		skill.setType(request.type());

		Skill saved = skillRepository.save(skill);
		return SkillDTO.fromEntity(saved);
	}

	@Override
	public SkillDTO updateSkill(Long id, UpdateSkillRequest request) {
		Skill skill = skillRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

		if (request.name() != null)
			skill.setName(request.name());
		if (request.description() != null)
			skill.setDescription(request.description());
		if (request.icon() != null)
			skill.setIcon(request.icon());
		if (request.proficiency() != null)
			skill.setProficiency(request.proficiency());
		if (request.type() != null)
			skill.setType(request.type());

		Skill saved = skillRepository.save(skill);
		return SkillDTO.fromEntity(saved);
	}

	@Override
	public void deleteSkill(Long id) {
		if (!skillRepository.existsById(id)) {
			throw new ResourceNotFoundException("Skill not found with id: " + id);
		}
		skillRepository.deleteById(id);
	}
}
