package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Author;
import com.hgthaii.tblog.domain.Category;
import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.domain.Tag;
import com.hgthaii.tblog.dto.PostDTO;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.dto.request.CreatePostRequest;
import com.hgthaii.tblog.dto.request.UpdatePostRequest;
import com.hgthaii.tblog.exception.ResourceNotFoundException;
import com.hgthaii.tblog.mapper.PostMapper;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.service.AuthorService;
import com.hgthaii.tblog.service.CategoryService;
import com.hgthaii.tblog.service.PostService;
import com.hgthaii.tblog.service.TagService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Implementation of PostService.
 * Refactored to follow SOLID principles:
 * - SRP: Delegates author/category/tag management to specialized services
 * - DIP: Depends on service interfaces, not implementations
 * - OCP: Extensible through composition of services
 */
@Service
@Transactional
public class PostServiceImpl implements PostService {

	private final PostRepository postRepository;
	private final AuthorService authorService;
	private final CategoryService categoryService;
	private final TagService tagService;
	private final PostMapper postMapper;

	public PostServiceImpl(
			PostRepository postRepository,
			AuthorService authorService,
			CategoryService categoryService,
			TagService tagService,
			PostMapper postMapper) {
		this.postRepository = postRepository;
		this.authorService = authorService;
		this.categoryService = categoryService;
		this.tagService = tagService;
		this.postMapper = postMapper;
	}

	@Override
	@Transactional(readOnly = true)
	public Page<PostDTO> getAllPosts(Pageable pageable, String category, String tag, String search) {
		Page<Post> postPage;

		if (category != null && !category.isEmpty()) {
			postPage = postRepository.findByCategorySlug(category, pageable);
		} else if (tag != null && !tag.isEmpty()) {
			postPage = postRepository.findByTagsSlug(tag, pageable);
		} else if (search != null && !search.isEmpty()) {
			postPage = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
					search, search, pageable);
		} else {
			postPage = postRepository.findAll(pageable);
		}

		return postPage.map(postMapper::toDTO);
	}

	@Override
	public PostDetailDTO getPostBySlug(String slug) {
		Post post = postRepository.findBySlug(slug)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));

		// Increment views
		post.setViews(post.getViews() + 1);
		postRepository.save(post);

		return postMapper.toDetailDTO(post);
	}

	@Override
	public PostDetailDTO createPost(CreatePostRequest request) {
		// Create post entity from request
		Post post = postMapper.toEntity(request);

		// Handle Author - delegate to AuthorService
		if (request.authorName() != null && !request.authorName().isEmpty()) {
			Author author = authorService.findOrCreateByName(request.authorName());
			post.setAuthor(author);
		}

		// Handle Category - delegate to CategoryService
		if (request.categorySlug() != null && !request.categorySlug().isEmpty()) {
			Category category = categoryService.findOrCreateBySlug(
					request.categorySlug(),
					request.categorySlug());
			post.setCategory(category);
		}

		// Handle Tags - delegate to TagService
		if (request.tags() != null && !request.tags().isEmpty()) {
			Set<Tag> tags = tagService.findOrCreateTags(request.tags());
			post.setTags(tags);
		}

		Post saved = postRepository.save(post);
		return postMapper.toDetailDTO(saved);
	}

	@Override
	public PostDetailDTO updatePost(Long id, UpdatePostRequest request) {
		Post post = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

		// Update basic fields - delegate to mapper
		postMapper.updateEntity(post, request);

		// Update Author - delegate to AuthorService
		if (request.authorName() != null) {
			Author author = authorService.findOrCreateByName(request.authorName());
			post.setAuthor(author);
		}

		// Update Category - delegate to CategoryService
		if (request.categorySlug() != null) {
			Category category = categoryService.findOrCreateBySlug(
					request.categorySlug(),
					request.categorySlug());
			post.setCategory(category);
		}

		// Update Tags - delegate to TagService
		if (request.tags() != null) {
			post.getTags().clear();
			Set<Tag> tags = tagService.findOrCreateTags(request.tags());
			post.setTags(tags);
		}

		Post saved = postRepository.save(post);
		return postMapper.toDetailDTO(saved);
	}

	@Override
	public void deletePost(Long id) {
		if (!postRepository.existsById(id)) {
			throw new ResourceNotFoundException("Post not found with id: " + id);
		}
		postRepository.deleteById(id);
	}
}
