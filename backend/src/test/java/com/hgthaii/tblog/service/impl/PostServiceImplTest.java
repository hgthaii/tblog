package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.dto.PostDetailDTO;
import com.hgthaii.tblog.exception.ResourceNotFoundException;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.service.MarkdownService;
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
	private MarkdownService markdownService;

	@InjectMocks
	private PostServiceImpl postService;

	private Post testPost;

	@BeforeEach
	void setUp() {
		testPost = new Post();
		testPost.setId(1L);
		testPost.setTitle("Test Title");
		testPost.setSlug("test-slug");
		testPost.setContent("# Test content");
		testPost.setViews(10);
		testPost.setCreatedAt(LocalDateTime.now());
	}

	@Test
	void getPostBySlug_ShouldReturnPost_AndIncrementViews() {
		// Arrange
		when(postRepository.findBySlug("test-slug")).thenReturn(Optional.of(testPost));
		when(markdownService.render(anyString())).thenReturn("<h1>Test content</h1>");

		// Act
		PostDetailDTO result = postService.getPostBySlug("test-slug");

		// Assert
		assertNotNull(result);
		assertEquals("test-slug", result.slug());
		assertEquals(11, testPost.getViews()); // Should be incremented
		verify(postRepository, times(1)).save(testPost);
	}

	@Test
	void getPostBySlug_ShouldThrowException_WhenPostNotFound() {
		// Arrange
		when(postRepository.findBySlug("non-existent")).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(ResourceNotFoundException.class, () -> postService.getPostBySlug("non-existent"));
		verify(postRepository, never()).save(any());
	}
}
