package com.hgthaii.tblog.controller.api;

import com.hgthaii.tblog.dto.CategoryDTO;
import com.hgthaii.tblog.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryApiController {

	private final CategoryRepository categoryRepository;

	public CategoryApiController(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@GetMapping
	public ResponseEntity<List<CategoryDTO>> getAllCategories() {
		List<CategoryDTO> categories = categoryRepository.findAll().stream()
				.map(CategoryDTO::fromEntity)
				.collect(Collectors.toList());
		return ResponseEntity.ok(categories);
	}
}
