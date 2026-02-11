package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Tag;
import com.hgthaii.tblog.repository.TagRepository;
import com.hgthaii.tblog.service.TagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of TagService.
 * Handles all tag-related business logic.
 */
@Service
@Transactional
public class TagServiceImpl implements TagService {

	private final TagRepository tagRepository;

	public TagServiceImpl(TagRepository tagRepository) {
		this.tagRepository = tagRepository;
	}

	@Override
	public Tag findOrCreateBySlug(String slug, String name) {
		String normalizedSlug = slug.trim().toLowerCase();
		return tagRepository.findBySlug(normalizedSlug)
				.orElseGet(() -> {
					Tag tag = Tag.builder()
							.name(name != null ? name : slug)
							.slug(normalizedSlug)
							.build();
					return tagRepository.save(tag);
				});
	}

	@Override
	public Set<Tag> findOrCreateTags(String commaSeparatedTags) {
		if (commaSeparatedTags == null || commaSeparatedTags.trim().isEmpty()) {
			return new HashSet<>();
		}

		return Arrays.stream(commaSeparatedTags.split(","))
				.map(String::trim)
				.filter(s -> !s.isEmpty())
				.map(tagName -> findOrCreateBySlug(tagName.toLowerCase(), tagName))
				.collect(Collectors.toSet());
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Tag> findBySlug(String slug) {
		return tagRepository.findBySlug(slug);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Tag> findAll() {
		return tagRepository.findAll();
	}
}
