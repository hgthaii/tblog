package com.hgthaii.tblog.mapper;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.dto.PostDTO;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.dto.request.CreatePostRequest;
import com.hgthaii.tblog.dto.request.UpdatePostRequest;

/**
 * Mapper interface for Post entity and DTO conversions.
 * Follows Separation of Concerns by isolating mapping logic from business
 * logic.
 */
public interface PostMapper {

	/**
	 * Convert Post entity to PostDTO.
	 *
	 * @param post the post entity
	 * @return PostDTO
	 */
	PostDTO toDTO(Post post);

	/**
	 * Convert Post entity to PostDetailDTO with full content.
	 *
	 * @param post the post entity
	 * @return PostDetailDTO
	 */
	PostDetailDTO toDetailDTO(Post post);

	/**
	 * Convert CreatePostRequest to Post entity.
	 *
	 * @param request the create request
	 * @return new Post entity
	 */
	Post toEntity(CreatePostRequest request);

	/**
	 * Update existing Post entity from UpdatePostRequest.
	 *
	 * @param post    the existing post entity
	 * @param request the update request
	 */
	void updateEntity(Post post, UpdatePostRequest request);
}
