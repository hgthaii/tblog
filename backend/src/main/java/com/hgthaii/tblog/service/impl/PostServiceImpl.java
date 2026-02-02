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
import com.hgthaii.tblog.repository.AuthorRepository;
import com.hgthaii.tblog.repository.CategoryRepository;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.repository.TagRepository;
import com.hgthaii.tblog.service.MarkdownService;
import com.hgthaii.tblog.service.PostService;
import com.hgthaii.tblog.service.PostViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostServiceImpl implements PostService {

	private final PostRepository postRepository;
	private final AuthorRepository authorRepository;
	private final CategoryRepository categoryRepository;
	private final TagRepository tagRepository;
	private final MarkdownService markdownService;
	private final PostViewService postViewService;

	public PostServiceImpl(PostRepository postRepository, AuthorRepository authorRepository,
			CategoryRepository categoryRepository, TagRepository tagRepository,
			MarkdownService markdownService, PostViewService postViewService) {
		this.postRepository = postRepository;
		this.authorRepository = authorRepository;
		this.categoryRepository = categoryRepository;
		this.tagRepository = tagRepository;
		this.markdownService = markdownService;
		this.postViewService = postViewService;
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
			postPage = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(search, search,
					pageable);
		} else {
			postPage = postRepository.findAll(pageable);
		}

		return postPage.map(this::convertToDTO);
	}

	@Override
	public PostDetailDTO getPostBySlug(String slug) {
		Post post = postRepository.findBySlug(slug)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));

		// Increment views
		post.setViews(post.getViews() + 1);
		postRepository.save(post);

		return convertToDetailDTO(post);
	}

	@Override
	public PostDetailDTO createPost(CreatePostRequest request) {
		Post post = new Post();
		post.setTitle(request.title());
		post.setSlug(request.slug().trim().toLowerCase());
		post.setContent(request.content());
		post.setCreatedAt(LocalDateTime.now());
		post.setUpdatedAt(LocalDateTime.now());

		// Handle Author
		if (request.authorName() != null && !request.authorName().isEmpty()) {
			Author author = authorRepository.findByName(request.authorName())
					.orElseGet(() -> {
						Author a = new Author();
						a.setName(request.authorName());
						return authorRepository.save(a);
					});
			post.setAuthor(author);
		}

		// Handle Category
		if (request.categorySlug() != null && !request.categorySlug().isEmpty()) {
			String slug = request.categorySlug().trim().toLowerCase();
			Category category = categoryRepository.findBySlug(slug)
					.orElseGet(() -> {
						Category c = new Category();
						c.setName(slug);
						c.setSlug(slug);
						return categoryRepository.save(c);
					});
			post.setCategory(category);
		}

		// Handle Tags
		if (request.tags() != null && !request.tags().isEmpty()) {
			Arrays.stream(request.tags().split(","))
					.map(String::trim)
					.filter(s -> !s.isEmpty())
					.forEach(tagSlug -> {
						Tag tag = tagRepository.findBySlug(tagSlug.toLowerCase())
								.orElseGet(() -> {
									Tag t = new Tag();
									t.setName(tagSlug);
									t.setSlug(tagSlug.toLowerCase());
									return tagRepository.save(t);
								});
						post.getTags().add(tag);
					});
		}

		Post saved = postRepository.save(post);
		return convertToDetailDTO(saved);
	}

	@Override
	public PostDetailDTO updatePost(Long id, UpdatePostRequest request) {
		Post post = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

		if (request.title() != null)
			post.setTitle(request.title());
		if (request.slug() != null)
			post.setSlug(request.slug().trim().toLowerCase());
		if (request.content() != null)
			post.setContent(request.content());

		post.setUpdatedAt(LocalDateTime.now());

		// Update Author
		if (request.authorName() != null) {
			Author author = authorRepository.findByName(request.authorName())
					.orElseGet(() -> {
						Author a = new Author();
						a.setName(request.authorName());
						return authorRepository.save(a);
					});
			post.setAuthor(author);
		}

		// Update Category
		if (request.categorySlug() != null) {
			String slug = request.categorySlug().trim().toLowerCase();
			Category category = categoryRepository.findBySlug(slug)
					.orElseGet(() -> {
						Category c = new Category();
						c.setName(slug);
						c.setSlug(slug);
						return categoryRepository.save(c);
					});
			post.setCategory(category);
		}

		// Update Tags
		if (request.tags() != null) {
			post.getTags().clear();
			Arrays.stream(request.tags().split(","))
					.map(String::trim)
					.filter(s -> !s.isEmpty())
					.forEach(tagSlug -> {
						Tag tag = tagRepository.findBySlug(tagSlug.toLowerCase())
								.orElseGet(() -> {
									Tag t = new Tag();
									t.setName(tagSlug);
									t.setSlug(tagSlug.toLowerCase());
									return tagRepository.save(t);
								});
						post.getTags().add(tag);
					});
		}

		Post saved = postRepository.save(post);
		return convertToDetailDTO(saved);
	}

	@Override
	public void deletePost(Long id) {
		if (!postRepository.existsById(id)) {
			throw new ResourceNotFoundException("Post not found with id: " + id);
		}
		postRepository.deleteById(id);
	}

	private PostDTO convertToDTO(Post post) {
		return new PostDTO(
				post.getId(),
				post.getTitle(),
				post.getSlug(),
				postViewService.excerpt(post.getContent()),
				post.getCreatedAt(),
				post.getAuthor() != null ? post.getAuthor().getName() : "Unknown",
				post.getCategory() != null ? post.getCategory().getName() : "Uncategorized");
	}

	private PostDetailDTO convertToDetailDTO(Post post) {
		return new PostDetailDTO(
				post.getId(),
				post.getTitle(),
				post.getSlug(),
				post.getContent(),
				markdownService.render(post.getContent()),
				post.getCreatedAt(),
				post.getAuthor() != null ? post.getAuthor().getName() : "Unknown",
				post.getCategory() != null ? post.getCategory().getName() : "Uncategorized",
				post.getViews());
	}
}
