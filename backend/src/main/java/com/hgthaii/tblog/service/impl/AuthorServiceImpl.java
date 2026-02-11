package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Author;
import com.hgthaii.tblog.repository.AuthorRepository;
import com.hgthaii.tblog.service.AuthorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of AuthorService.
 * Handles all author-related business logic.
 */
@Service
@Transactional
public class AuthorServiceImpl implements AuthorService {

	private final AuthorRepository authorRepository;

	public AuthorServiceImpl(AuthorRepository authorRepository) {
		this.authorRepository = authorRepository;
	}

	@Override
	public Author findOrCreateByName(String name) {
		return authorRepository.findByName(name)
				.orElseGet(() -> {
					Author author = Author.builder()
							.name(name)
							.build();
					return authorRepository.save(author);
				});
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Author> findByName(String name) {
		return authorRepository.findByName(name);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Author> findAll() {
		return authorRepository.findAll();
	}
}
