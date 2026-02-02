package com.hgthaii.tblog.dto.response;

public record AuthResponse(
		String username,
		String role,
		String token // If using JWT, otherwise null for Session
) {
}
