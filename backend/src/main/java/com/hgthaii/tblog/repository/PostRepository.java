package com.hgthaii.tblog.repository;

import com.hgthaii.tblog.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
	@EntityGraph(attributePaths = { "author", "category" })
	Page<Post> findAll(Pageable pageable);

	@EntityGraph(attributePaths = { "author", "category" })
	Optional<Post> findBySlug(String slug);

	@EntityGraph(attributePaths = { "author", "category" })
	Page<Post> findByCategorySlug(String categorySlug, Pageable pageable);

	@EntityGraph(attributePaths = { "author", "category" })
	Page<Post> findByTagsSlug(String tagSlug, Pageable pageable);

	@EntityGraph(attributePaths = { "author", "category" })
	Page<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content,
			Pageable pageable);
}
