package com.hgthaii.tblog.repository;

import com.hgthaii.tblog.domain.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
	List<Skill> findByType(Skill.SkillType type);
}
