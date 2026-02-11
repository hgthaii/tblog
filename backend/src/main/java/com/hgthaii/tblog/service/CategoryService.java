package com.hgthaii.tblog.service;

import com.hgthaii.tblog.domain.Category;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Category management operations.
 * Follows Single Responsibility Principle by handling only category-related
 * logic.
 */
public interface CategoryService {

	/**
	 * Find an existing category by slug or create a new one if not found.
	 *
	 * @param slug the category slug
	 * @param name the category name (used when creating new category)
	 * @return the found or newly created category
	 */
	Category findOrCreateBySlug(String slug, String name);

	/**
	 * Find a category by slug.
	 *
	 * @param slug the category slug
	 * @return Optional containing the category if found
	 */
	Optional<Category> findBySlug(String slug);

	/**
	 * Get all categories.
	 *
	 * @return list of all categories
	 */
	List<Category> findAll();
}
