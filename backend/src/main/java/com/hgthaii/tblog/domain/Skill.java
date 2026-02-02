package com.hgthaii.tblog.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(length = 1000)
	private String description; // Optional markdown description

	private String icon; // SVG or URL

	@Column(nullable = false)
	private Integer proficiency; // 1-100 or 1-5

	@Enumerated(EnumType.STRING)
	private SkillType type; // LANGUAGE, FRAMEWORK, TOOL, DATABASE

	public enum SkillType {
		LANGUAGE, FRAMEWORK, TOOL, DATABASE, OTHER
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public Integer getProficiency() {
		return proficiency;
	}

	public void setProficiency(Integer proficiency) {
		this.proficiency = proficiency;
	}

	public SkillType getType() {
		return type;
	}

	public void setType(SkillType type) {
		this.type = type;
	}
}
