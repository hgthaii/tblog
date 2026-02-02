package com.hgthaii.tblog.controller;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.domain.Author;
import com.hgthaii.tblog.domain.Category;
import com.hgthaii.tblog.domain.Tag;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.repository.AuthorRepository;
import com.hgthaii.tblog.repository.CategoryRepository;
import com.hgthaii.tblog.repository.TagRepository;
import com.hgthaii.tblog.service.MarkdownService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import jakarta.validation.Valid;

@Controller
public class AdminController {

    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final MarkdownService markdownService;

    public AdminController(PostRepository postRepository,
                           AuthorRepository authorRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository,
                           MarkdownService markdownService) {
        this.postRepository = postRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
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
    public String save(@Valid @ModelAttribute Post post,
                       BindingResult bindingResult,
                       @RequestParam String authorName,
                       @RequestParam String categorySlug,
                       @RequestParam String tags,
                       Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("mode", "create");
            return "admin";
        }

        Author author = authorRepository
                .findByName(authorName)
                .orElseGet(() -> {
                    Author a = new Author();
                    a.setName(authorName);
                    return authorRepository.save(a);
                });

        String categorySlugNormalized = categorySlug.trim().toLowerCase();

        Category category = categoryRepository
                .findBySlug(categorySlugNormalized)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(categorySlugNormalized);
                    c.setSlug(categorySlugNormalized);
                    return categoryRepository.save(c);
                });

        post.setAuthor(author);
        post.setCategory(category);
        post.getTags().clear();

        String[] tagArray = tags.split(",");

        for (String raw : tagArray) {
            String slug = raw.trim().toLowerCase();
            if (slug.isEmpty()) continue;

            Tag tag = tagRepository
                    .findBySlug(slug)
                    .orElseGet(() -> {
                        Tag t = new Tag();
                        t.setName(slug);
                        t.setSlug(slug);
                        return tagRepository.save(t);
                    });

            post.getTags().add(tag);
        }

        post.setSlug(post.getSlug().trim().toLowerCase());

        if (post.getId() == null) {
            post.setCreatedAt(java.time.LocalDateTime.now());
        }
        post.setUpdatedAt(java.time.LocalDateTime.now());

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