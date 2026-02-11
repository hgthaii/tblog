package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Skill entity representing technical skills and proficiency levels.
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Skill extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@Column(length = 1000)
	private String description;

	private String icon;

	@Column(nullable = false)
	private Integer proficiency;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private SkillType type;

	public enum SkillType {
		LANGUAGE, FRAMEWORK, TOOL, DATABASE, OTHER
	}
}
