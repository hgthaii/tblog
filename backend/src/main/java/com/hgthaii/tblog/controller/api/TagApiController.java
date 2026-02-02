package com.hgthaii.tblog.controller.api;

import com.hgthaii.tblog.dto.TagDTO;
import com.hgthaii.tblog.repository.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tags")
public class TagApiController {

	private final TagRepository tagRepository;

	public TagApiController(TagRepository tagRepository) {
		this.tagRepository = tagRepository;
	}

	@GetMapping
	public ResponseEntity<List<TagDTO>> getAllTags() {
		List<TagDTO> tags = tagRepository.findAll().stream()
				.map(TagDTO::fromEntity)
				.collect(Collectors.toList());
		return ResponseEntity.ok(tags);
	}
}
