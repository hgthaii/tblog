package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.service.MarkdownService;
import com.hgthaii.tblog.service.PostViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PostController {
    
    private final PostRepository postRepository;
    private final MarkdownService markdownService;
    private final PostViewService postViewService;
    public PostController(PostRepository postRepository, MarkdownService markdownService,  PostViewService postViewService) {
        this.postRepository = postRepository;
        this.markdownService = markdownService;
        this.postViewService = postViewService;
    }
    
    @GetMapping("/posts/{slug}")
    public String posts(@PathVariable String slug, Model model) {
        Post post = postRepository.findBySlug(slug).orElseThrow(() -> new RuntimeException("post not found"));
        String html = markdownService.render(post.getContent());
        String description = postViewService.excerpt(post.getContent());

        model.addAttribute("post", post);
        model.addAttribute("html", html);
        model.addAttribute("description", description);
        
        return "post";
    }
}
