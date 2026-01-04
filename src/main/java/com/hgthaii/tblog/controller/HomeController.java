package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.repository.PostRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    private final PostRepository postRepository;
    
    public HomeController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    @GetMapping("/")
    public String home(Model model) {
        var posts = postRepository.findAll(
                PageRequest.of(
                        0, 5 ,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
        ).getContent();
        model.addAttribute("posts", posts);
        return "home";
    }
}
