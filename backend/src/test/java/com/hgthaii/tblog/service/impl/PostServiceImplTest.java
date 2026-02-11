package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.exception.ResourceNotFoundException;
import com.hgthaii.tblog.mapper.PostMapper;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.service.AuthorService;
import com.hgthaii.tblog.service.CategoryService;
import com.hgthaii.tblog.service.TagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceImplTest {

	@Mock
	private PostRepository postRepository;

	@Mock
	private AuthorService authorService;

	@Mock
	private CategoryService categoryService;

	@Mock
	private TagService tagService;

	@Mock
	private PostMapper postMapper;

	@InjectMocks
	private PostServiceImpl postService;

	private Post testPost;
	private PostDetailDTO testPostDetailDTO;

	@BeforeEach
	void setUp() {
		testPost = Post.builder()
				.title("Test Title")
				.slug("test-slug")
				.content("# Test content")
				.views(10)
				.build();
		testPost.setId(1L);
		testPost.setCreatedAt(LocalDateTime.now());

		testPostDetailDTO = new PostDetailDTO(
				1L,
				"Test Title",
				"test-slug",
				"# Test content",
				"<h1>Test content</h1>",
				testPost.getCreatedAt(),
				"Unknown",
				"Uncategorized",
				11);
	}

	@Test
	void getPostBySlug_ShouldReturnPost_AndIncrementViews() {
		// Arrange
		when(postRepository.findBySlug("test-slug")).thenReturn(Optional.of(testPost));
		when(postMapper.toDetailDTO(testPost)).thenReturn(testPostDetailDTO);

		// Act
		PostDetailDTO result = postService.getPostBySlug("test-slug");

		// Assert
		assertNotNull(result);
		assertEquals("test-slug", result.slug());
		assertEquals(11, testPost.getViews()); // Should be incremented
		verify(postRepository, times(1)).save(testPost);
		verify(postMapper, times(1)).toDetailDTO(testPost);
	}

	@Test
	void getPostBySlug_ShouldThrowException_WhenPostNotFound() {
		// Arrange
		when(postRepository.findBySlug("non-existent")).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(ResourceNotFoundException.class, () -> postService.getPostBySlug("non-existent"));
		verify(postRepository, never()).save(any());
		verify(postMapper, never()).toDetailDTO(any());
	}
}
