package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Post entity representing blog posts.
 */
@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true, exclude = { "author", "category", "tags" })
public class Post extends BaseEntity {

	@Column(nullable = false)
	private String title;

	@Column(unique = true, nullable = false)
	private String slug;

	@Lob
	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "author_id")
	private Author author;

	@Column(columnDefinition = "integer default 0")
	@Builder.Default
	private Integer views = 0;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToMany
	@JoinTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
	@Builder.Default
	private Set<Tag> tags = new HashSet<>();
}