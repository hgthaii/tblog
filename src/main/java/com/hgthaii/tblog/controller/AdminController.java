package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.service.MarkdownService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

@Controller
public class AdminController {

    private final PostRepository postRepository;
    private final MarkdownService markdownService;

    public AdminController(PostRepository postRepository,
                           MarkdownService markdownService) {
        this.postRepository = postRepository;
        this.markdownService = markdownService;
    }

    /* ========== CREATE ========== */

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("post", new Post());
        model.addAttribute("mode", "create");
        return "admin";
    }

    @PostMapping("/admin")
    public String save(@ModelAttribute Post post) {
        post.setAuthor("Thái");
        post.setCategory("Blog");
        post.setTags("dev,blog");

        postRepository.save(post);
        return "redirect:/posts/" + post.getSlug();
    }

    /* ========== EDIT ========== */

    @GetMapping("/admin/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        model.addAttribute("post", post);
        model.addAttribute("mode", "edit");
        return "admin";
    }

    /* ========== DELETE ========== */

    @PostMapping("/admin/delete/{id}")
    public String delete(@PathVariable Long id) {
        postRepository.deleteById(id);
        return "redirect:/";
    }

    /* ========== PREVIEW ========== */

    @PostMapping("/admin/preview")
    @ResponseBody
    public String preview(@RequestParam String content) {
        return markdownService.render(content);
    }
}