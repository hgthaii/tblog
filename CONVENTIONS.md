# Coding Conventions

## General Rules
- **Language Level**: Use Java 25 features where appropriate.
- **Dependency Injection**: Use **Constructor Injection** for all dependencies (avoid `@Autowired` on fields).
- **Lombok**: Use `@Getter`, `@Setter`, `@RequiredArgsConstructor`, etc., to reduce boilerplate.

## Naming Conventions
- **Classes**: PascalCase (e.g., `PostController`).
- **Methods/Variables**: camelCase (e.g., `findBySlug`).
- **Constants**: UPPER_SNAKE_CASE.
- **Tables**: lowercase Plural (e.g., `posts`, `users` - enforced via JPA/Hibernate naming).

## Best Practices
1.  **Repository Protocol**: Return `Optional<T>` for single entity lookups.
2.  **Controller**: Keep controllers thin. Delegate logic to Services.
3.  **Entities**: Use JPA annotations to define constraints (`@Column(unique = true)`, `@Lob`, etc.).
4.  **Logging**: Use `@Slf4j` if logging is needed.

## Database
- Default interactions should go through **Spring Data JPA Repositories**.
- Use `spring.jpa.hibernate.ddl-auto=update` for development to keep schema in sync.

## Frontend
- Place HTML templates in `src/main/resources/templates`.
- Place static assets (CSS, JS) in `src/main/resources/static`.
