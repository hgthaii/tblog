package com.hgthaii.tblog.controller.api;

import com.hgthaii.tblog.dto.PostDTO;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.dto.request.CreatePostRequest;
import com.hgthaii.tblog.dto.request.UpdatePostRequest;
import com.hgthaii.tblog.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
public class PostApiController {

	private final PostService postService;

	public PostApiController(PostService postService) {
		this.postService = postService;
	}

	@GetMapping
	public ResponseEntity<Page<PostDTO>> getAllPosts(
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String tag,
			@RequestParam(required = false) String search) {

		int pageIndex = Math.max(0, page - 1);
		PageRequest pageRequest = PageRequest.of(pageIndex, size, Sort.by("createdAt").descending());

		return ResponseEntity.ok(postService.getAllPosts(pageRequest, category, tag, search));
	}

	@GetMapping("/{slug}")
	public ResponseEntity<PostDetailDTO> getPostBySlug(@PathVariable String slug) {
		return ResponseEntity.ok(postService.getPostBySlug(slug));
	}

	@PostMapping
	public ResponseEntity<PostDetailDTO> createPost(@Valid @RequestBody CreatePostRequest request) {
		PostDetailDTO created = postService.createPost(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<PostDetailDTO> updatePost(
			@PathVariable Long id,
			@Valid @RequestBody UpdatePostRequest request) {
		return ResponseEntity.ok(postService.updatePost(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePost(@PathVariable Long id) {
		postService.deletePost(id);
		return ResponseEntity.noContent().build();
	}
}
