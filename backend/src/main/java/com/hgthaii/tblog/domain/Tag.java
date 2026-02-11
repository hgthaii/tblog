package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Tag entity for labeling blog posts.
 */
@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Tag extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@Column(unique = true, nullable = false)
	private String slug;
}
