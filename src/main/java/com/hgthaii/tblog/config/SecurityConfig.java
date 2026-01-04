package com.hgthaii.tblog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/", "/posts/**", "/css/**").permitAll()
                    .requestMatchers("/admin/**").authenticated()
                    .anyRequest().permitAll()
            ).formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/admin", true).permitAll())
            .logout(logout -> logout.logoutSuccessUrl("/"));
        return http.build();
    }
}
