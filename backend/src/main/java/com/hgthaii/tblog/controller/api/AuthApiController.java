package com.hgthaii.tblog.controller.api;

import com.hgthaii.tblog.dto.request.LoginRequest;
import com.hgthaii.tblog.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthApiController {

	@PostConstruct
	public void init() {
		System.out.println("AuthApiController initialized!");
	}

	private final AuthenticationManager authenticationManager;

	public AuthApiController(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
	private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder
			.getContextHolderStrategy();

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
			HttpServletRequest servletRequest,
			HttpServletResponse servletResponse) {

		UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
				request.username(), request.password());

		Authentication authentication = authenticationManager.authenticate(token);

		SecurityContext context = securityContextHolderStrategy.createEmptyContext();
		context.setAuthentication(authentication);
		securityContextHolderStrategy.setContext(context);
		securityContextRepository.saveContext(context, servletRequest, servletResponse);

		String role = authentication.getAuthorities().stream()
				.map(a -> a.getAuthority())
				.findFirst()
				.orElse("ROLE_USER");

		return ResponseEntity.ok(new AuthResponse(authentication.getName(), role, null));
	}

	@GetMapping("/me")
	public ResponseEntity<AuthResponse> me(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		String role = authentication.getAuthorities().stream()
				.map(a -> a.getAuthority())
				.findFirst()
				.orElse("ROLE_USER");

		return ResponseEntity.ok(new AuthResponse(authentication.getName(), role, null));
	}
}
