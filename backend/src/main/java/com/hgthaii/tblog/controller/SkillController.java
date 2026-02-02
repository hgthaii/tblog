package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.domain.Skill;
import com.hgthaii.tblog.service.SkillService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SkillController {

	private final SkillService skillService;

	public SkillController(SkillService skillService) {
		this.skillService = skillService;
	}

	@GetMapping("/skills")
	public String skills(Model model) {
		model.addAttribute("groupedSkills", skillService.getSkillsGroupedByType());
		return "skills"; // Public view
	}

	// Admin routes
	@GetMapping("/admin/skills")
	public String adminSkills(Model model) {
		model.addAttribute("skills", skillService.getAllSkills());
		model.addAttribute("newSkill", new Skill());
		model.addAttribute("types", Skill.SkillType.values());
		return "admin-skills";
	}

	@PostMapping("/admin/skills")
	public String saveSkill(@ModelAttribute Skill skill) {
		skillService.saveSkill(skill);
		return "redirect:/admin/skills";
	}

	@PostMapping("/admin/skills/delete")
	public String deleteSkill(@RequestParam Long id) {
		skillService.deleteSkill(id);
		return "redirect:/admin/skills";
	}
}
