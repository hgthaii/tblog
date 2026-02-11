package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Category;
import com.hgthaii.tblog.repository.CategoryRepository;
import com.hgthaii.tblog.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of CategoryService.
 * Handles all category-related business logic.
 */
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;

	public CategoryServiceImpl(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Override
	public Category findOrCreateBySlug(String slug, String name) {
		String normalizedSlug = slug.trim().toLowerCase();
		return categoryRepository.findBySlug(normalizedSlug)
				.orElseGet(() -> {
					Category category = Category.builder()
							.name(name != null ? name : normalizedSlug)
							.slug(normalizedSlug)
							.build();
					return categoryRepository.save(category);
				});
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Category> findBySlug(String slug) {
		return categoryRepository.findBySlug(slug);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Category> findAll() {
		return categoryRepository.findAll();
	}
}
