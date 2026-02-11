package com.hgthaii.tblog.mapper.impl;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.dto.PostDTO;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.dto.request.CreatePostRequest;
import com.hgthaii.tblog.dto.request.UpdatePostRequest;
import com.hgthaii.tblog.mapper.PostMapper;
import com.hgthaii.tblog.service.MarkdownService;
import com.hgthaii.tblog.service.PostViewService;
import org.springframework.stereotype.Component;

/**
 * Implementation of PostMapper.
 * Handles all Post entity-DTO conversions.
 */
@Component
public class PostMapperImpl implements PostMapper {

	private final MarkdownService markdownService;
	private final PostViewService postViewService;

	public PostMapperImpl(MarkdownService markdownService, PostViewService postViewService) {
		this.markdownService = markdownService;
		this.postViewService = postViewService;
	}

	@Override
	public PostDTO toDTO(Post post) {
		return new PostDTO(
				post.getId(),
				post.getTitle(),
				post.getSlug(),
				postViewService.excerpt(post.getContent()),
				post.getCreatedAt(),
				post.getAuthor() != null ? post.getAuthor().getName() : "Unknown",
				post.getCategory() != null ? post.getCategory().getName() : "Uncategorized");
	}

	@Override
	public PostDetailDTO toDetailDTO(Post post) {
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

	@Override
	public Post toEntity(CreatePostRequest request) {
		return Post.builder()
				.title(request.title())
				.slug(request.slug().trim().toLowerCase())
				.content(request.content())
				.views(0)
				.build();
	}

	@Override
	public void updateEntity(Post post, UpdatePostRequest request) {
		if (request.title() != null) {
			post.setTitle(request.title());
		}
		if (request.slug() != null) {
			post.setSlug(request.slug().trim().toLowerCase());
		}
		if (request.content() != null) {
			post.setContent(request.content());
		}
	}
}
