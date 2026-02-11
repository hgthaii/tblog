package com.hgthaii.tblog.service;

import com.hgthaii.tblog.domain.Author;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Author management operations.
 * Follows Single Responsibility Principle by handling only author-related
 * logic.
 */
public interface AuthorService {

	/**
	 * Find an existing author by name or create a new one if not found.
	 *
	 * @param name the author name
	 * @return the found or newly created author
	 */
	Author findOrCreateByName(String name);

	/**
	 * Find an author by name.
	 *
	 * @param name the author name
	 * @return Optional containing the author if found
	 */
	Optional<Author> findByName(String name);

	/**
	 * Get all authors.
	 *
	 * @return list of all authors
	 */
	List<Author> findAll();
}
