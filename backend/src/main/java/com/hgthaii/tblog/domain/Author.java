package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Author entity representing blog post authors.
 */
@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Author extends BaseEntity {

	@Column(unique = true, nullable = false)
	private String name;

	@Column(length = 1000)
	private String bio;

	private String avatar;
}
