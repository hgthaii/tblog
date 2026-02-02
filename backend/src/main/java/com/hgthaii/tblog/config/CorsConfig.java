package com.hgthaii.tblog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		// Allow credentials (cookies, authorization headers)
		config.setAllowCredentials(true);

		// Allow Frontend origin
		config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

		// Allow all headers
		config.addAllowedHeader("*");

		// Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
		config.addAllowedMethod("*");

		// Apply CORS config to all API endpoints
		source.registerCorsConfiguration("/api/**", config);

		return new CorsFilter(source);
	}
}
