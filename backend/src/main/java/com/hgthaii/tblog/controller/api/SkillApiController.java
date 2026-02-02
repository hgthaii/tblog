package com.hgthaii.tblog.controller.api;

import com.hgthaii.tblog.dto.SkillDTO;
import com.hgthaii.tblog.dto.request.CreateSkillRequest;
import com.hgthaii.tblog.dto.request.UpdateSkillRequest;
import com.hgthaii.tblog.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillApiController {

	private final SkillService skillService;

	public SkillApiController(SkillService skillService) {
		this.skillService = skillService;
	}

	/**
	 * Get all skills grouped by type
	 * 
	 * @return Map of SkillType -> List of Skills
	 */
	@GetMapping
	public ResponseEntity<Map<String, List<SkillDTO>>> getAllSkillsGrouped() {
		Map<String, List<SkillDTO>> groupedSkills = skillService.getSkillsGroupedByTypeAsDTO();
		return ResponseEntity.ok(groupedSkills);
	}

	/**
	 * Get all skills as flat list
	 * 
	 * @return List of all skills
	 */
	@GetMapping("/list")
	public ResponseEntity<List<SkillDTO>> getAllSkills() {
		List<SkillDTO> skills = skillService.getAllSkillsAsDTO();
		return ResponseEntity.ok(skills);
	}

	/**
	 * Get skill by ID
	 * 
	 * @param id Skill ID
	 * @return Skill details
	 */
	@GetMapping("/{id}")
	public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
		SkillDTO skill = skillService.getSkillByIdAsDTO(id);
		return ResponseEntity.ok(skill);
	}

	/**
	 * Create new skill (Admin only)
	 * 
	 * @param request Skill creation request
	 * @return Created skill
	 */
	@PostMapping
	public ResponseEntity<SkillDTO> createSkill(@Valid @RequestBody CreateSkillRequest request) {
		SkillDTO created = skillService.createSkill(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	/**
	 * Update existing skill (Admin only)
	 * 
	 * @param id      Skill ID
	 * @param request Skill update request
	 * @return Updated skill
	 */
	@PutMapping("/{id}")
	public ResponseEntity<SkillDTO> updateSkill(
			@PathVariable Long id,
			@Valid @RequestBody UpdateSkillRequest request) {
		SkillDTO updated = skillService.updateSkill(id, request);
		return ResponseEntity.ok(updated);
	}

	/**
	 * Delete skill (Admin only)
	 * 
	 * @param id Skill ID
	 * @return No content
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
		skillService.deleteSkill(id);
		return ResponseEntity.noContent().build();
	}
}
