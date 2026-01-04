package com.hgthaii.tblog.config;

import com.hgthaii.tblog.domain.Post;
import com.hgthaii.tblog.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner loadPosts(PostRepository repo) {
        return args -> {
            if (repo.count() > 0) return;

            repo.save(create(
                "Một ngày làm dev",
                "mot-ngay-lam-dev",
                """
# Một ngày làm dev

Sáng mở máy, bug chào đón.
Trưa fix xong bug cũ, sinh bug mới.
Tối commit với hy vọng sáng mai mọi thứ ổn 🤡

> Nghề chọn mình chứ mình có chọn nghề đâu.

## Bug không tự nhiên sinh ra

Bug là kết quả của:
- deadline
- thiếu ngủ
- niềm tin mù quáng vào code cũ

```java
while(true) {
    fixBug();
}
"""
                ));

            repo.save(create(
                "Viết code sao cho đỡ khổ",
                "viet-code-sao-cho-do-kho",
                """
        Viết code sao cho đỡ khổ
        
        Code không cần hay, chỉ cần dễ đọc.
        
        Nguyên tắc sống còn
            •	Đặt tên rõ ràng
            •	Ít magic
            •	Viết cho người khác đọc
        
        Code là để đọc, không phải để khoe.
        
        ⸻
        
        Nhớ nha
        
        Nếu 6 tháng sau bạn đọc lại mà không hiểu,
        thì chính bạn là người bị chửi đầu tiên.
        """
                        ));

            repo.save(create(
                    "Spring Boot cho người lười",
                    "spring-boot-cho-nguoi-luoi",
                    """
        
        Spring Boot cho người lười
        
        Spring Boot sinh ra để:
            •	khỏi config XML
            •	khỏi viết boilerplate
            •	khỏi đau đầu
        
        Khi nào nên dùng Spring Boot?
            •	CRUD app
            •	Blog
            •	Admin tool
        
        @SpringBootApplication
        public class App {
          public static void main(String[] args) {
            SpringApplication.run(App.class, args);
          }
        }
        
        """
        ));

            repo.save(create(
                    "Markdown và những điều nhỏ nhặt",
                    "markdown-va-nhung-dieu-nho-nhat",
                    """
        
        Markdown và những điều nhỏ nhặt
        
        Markdown không phải để làm màu,
        mà để tập trung vào nội dung.
        
        Vì sao dev thích markdown?
            •	gọn
            •	dễ viết
            •	dễ diff
        
        Ít format hơn, nhiều suy nghĩ hơn.
        """
        ));

            repo.save(create(
                    "Làm blog cá nhân có ích không?",
                    "lam-blog-ca-nhan-co-ich-khong",
                    """
        
        Làm blog cá nhân có ích không?
        
        Câu trả lời ngắn gọn: có.
        
        Ích lợi thấy rõ
            •	nhớ lâu hơn
            •	hệ thống lại kiến thức
            •	có cái nhìn lại bản thân
        
        ⸻
        
        Không cần ai đọc,
        chỉ cần mình đọc lại là đủ.
        """
        ));
                                            };
                                        }
                                    
                                    private Post create(String title, String slug, String content) {
                                        Post p = new Post();
                                        p.setTitle(title);
                                        p.setSlug(slug);
                                        p.setContent(content);
                                        p.setAuthor("Thái");
                                        p.setCategory("Blog");
                                        p.setTags("dev,blog,life");
                                        return p;
                                    }
                        }
