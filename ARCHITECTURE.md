# Architecture & Tech Stack

## Technology Stack (The Modern Monolith)
- **Backend**: Java 25 + Spring Boot 4.0.1
    - Core framework for business logic and API.
- **Database**: SQLite
    - Zero-config, file-based (`data/tblog.db`).
    - Accessed via Spring Data JPA + Hibernate.
- **Frontend**: Thymeleaf + HTMX + Vanilla CSS
    - **Thymeleaf**: Server-side rendering for SEO and initial load.
    - **HTMX**: Dynamic interactions (like/comment/search) without complex SPA logic.
    - **CSS**: Minimalist, custom CSS variables (no frameworks like Bootstrap/Tailwind).

## Project Structure
```
src/main/java/com/hgthaii/tblog
├── config       # Security, AppConfig
├── controller   # MVC Controllers (return HTML)
├── domain       # JPA Entities (Post, Skill, etc.)
├── repository   # Data Access Interfaces
└── service      # Business Logic
```

## Key Features
1.  **Blog Engine**: Markdown-based posts, reading time calculation.
2.  **Admin Dashboard**: Secure management of content.
3.  **Skills & Tools**: Portfolio section for developer resources (Planned).
