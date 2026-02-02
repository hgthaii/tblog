package com.hgthaii.tblog.service;

import com.hgthaii.tblog.dto.PostDTO;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.dto.request.CreatePostRequest;
import com.hgthaii.tblog.dto.request.UpdatePostRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
	Page<PostDTO> getAllPosts(Pageable pageable, String category, String tag, String search);

	PostDetailDTO getPostBySlug(String slug);

	PostDetailDTO createPost(CreatePostRequest request);

	PostDetailDTO updatePost(Long id, UpdatePostRequest request);

	void deletePost(Long id);
}
