package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Category entity for organizing blog posts.
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Category extends BaseEntity {

	@Column(unique = true, nullable = false)
	private String name;

	@Column(unique = true, nullable = false)
	private String slug;
}
