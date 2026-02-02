package com.hgthaii.tblog.domain;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "tags")
public class Tag implements Serializable {

	@Id
	@GeneratedValue
	private Long id;

	private String name;

	@Column(unique = true)
	private String slug;

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

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}
}
