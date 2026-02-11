package com.hgthaii.tblog.service;

import com.hgthaii.tblog.domain.Tag;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service interface for Tag management operations.
 * Follows Single Responsibility Principle by handling only tag-related logic.
 */
public interface TagService {

	/**
	 * Find an existing tag by slug or create a new one if not found.
	 *
	 * @param slug the tag slug
	 * @param name the tag name (used when creating new tag)
	 * @return the found or newly created tag
	 */
	Tag findOrCreateBySlug(String slug, String name);

	/**
	 * Parse comma-separated tags and find or create each one.
	 *
	 * @param commaSeparatedTags comma-separated tag names
	 * @return set of found or created tags
	 */
	Set<Tag> findOrCreateTags(String commaSeparatedTags);

	/**
	 * Find a tag by slug.
	 *
	 * @param slug the tag slug
	 * @return Optional containing the tag if found
	 */
	Optional<Tag> findBySlug(String slug);

	/**
	 * Get all tags.
	 *
	 * @return list of all tags
	 */
	List<Tag> findAll();
}
