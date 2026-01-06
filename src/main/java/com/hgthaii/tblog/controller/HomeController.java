package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {
    private final PostRepository postRepository;
    
    public HomeController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    @GetMapping("/")
    public String home(
        @RequestParam(defaultValue = "1") int page,
        Model model
    ) {
        int pageIndex = page - 1;
        Page<Post> postPage = postRepository.findAll(
                PageRequest.of(pageIndex, 3, Sort.by("createdAt").descending())
        );

        model.addAttribute("posts", postPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", postPage.getTotalPages());
        return "home";
    }
}
