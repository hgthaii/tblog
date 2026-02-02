package com.hgthaii.tblog.config;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.domain.Author;
import com.hgthaii.tblog.domain.Category;
import com.hgthaii.tblog.domain.Tag;
import com.hgthaii.tblog.repository.PostRepository;
import com.hgthaii.tblog.repository.AuthorRepository;
import com.hgthaii.tblog.repository.CategoryRepository;
import com.hgthaii.tblog.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner loadPosts(PostRepository postRepo,
                                AuthorRepository authorRepo,
                                CategoryRepository categoryRepo,
                                TagRepository tagRepo) {
        return args -> {
            if (postRepo.count() > 0) return;

            Author author = new Author();
            author.setName("Thái");
            author.setBio("Dev thích viết blog");
            authorRepo.save(author);

            Category blog = new Category();
            blog.setName("Blog");
            blog.setSlug("blog");
            categoryRepo.save(blog);

            Category spring = new Category();
            spring.setName("Spring");
            spring.setSlug("spring");
            categoryRepo.save(spring);

            Tag dev = new Tag();
            dev.setName("dev");
            dev.setSlug("dev");
            tagRepo.save(dev);

            Tag life = new Tag();
            life.setName("life");
            life.setSlug("life");
            tagRepo.save(life);

            Tag springTag = new Tag();
            springTag.setName("spring");
            springTag.setSlug("spring");
            tagRepo.save(springTag);

            postRepo.save(create(
                    "Một ngày làm dev",
                    "mot-ngay-lam-dev",
                    SAMPLE_1,
                    author,
                    blog,
                    java.util.Set.of(dev, life)
            ));

            postRepo.save(create(
                    "Spring Boot cho người lười",
                    "spring-boot-cho-nguoi-luoi",
                    SAMPLE_2,
                    author,
                    spring,
                    java.util.Set.of(dev, springTag)
            ));

            postRepo.save(create(
                    "Viết code sao cho đỡ khổ",
                    "viet-code-sao-cho-do-kho",
                    SAMPLE_3,
                    author,
                    blog,
                    java.util.Set.of(dev, life)
            ));

            postRepo.save(create(
                    "Markdown và những điều nhỏ nhặt",
                    "markdown-va-nhung-dieu-nho-nhat",
                    SAMPLE_4,
                    author,
                    blog,
                    java.util.Set.of(dev)
            ));

            postRepo.save(create(
                    "Làm blog cá nhân có ích không?",
                    "lam-blog-ca-nhan-co-ich-khong",
                    SAMPLE_5,
                    author,
                    blog,
                    java.util.Set.of(life)
            ));
        };
    }

    private static final String SAMPLE_1 = """
# Một ngày làm dev
Sáng mở máy, bug chào đón.
Tối fix xong bug cũ, sinh bug mới.
""";

    private static final String SAMPLE_2 = """
# Spring Boot cho người lười
Spring Boot sinh ra để giảm đau khổ cho dev.
""";

    private static final String SAMPLE_3 = """
# Viết code sao cho đỡ khổ
Code là để đọc, không phải để khoe.
""";

    private static final String SAMPLE_4 = """
# Markdown và những điều nhỏ nhặt
Markdown giúp tập trung vào nội dung.
""";

    private static final String SAMPLE_5 = """
# Làm blog cá nhân có ích không?
Câu trả lời ngắn gọn: có.
""";

    private Post create(String title,
                        String slug,
                        String content,
                        Author author,
                        Category category,
                        java.util.Set<Tag> tags) {

        Post p = new Post();
        p.setTitle(title);
        p.setSlug(slug);
        p.setContent(content);
        p.setAuthor(author);
        p.setCategory(category);
        p.setTags(tags);
        return p;
    }
}
