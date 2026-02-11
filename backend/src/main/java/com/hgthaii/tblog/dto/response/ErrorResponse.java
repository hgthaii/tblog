package com.hgthaii.tblog.dto.response;

import java.time.LocalDateTime;

/**
 * Standardized error response DTO.
 *
 * @param timestamp when the error occurred
 * @param status    HTTP status code
 * @param error     error type/name
 * @param message   error message
 * @param path      request path that caused the error
 */
public record ErrorResponse(
		LocalDateTime timestamp,
		int status,
		String error,
		String message,
		String path) {
	public static ErrorResponse of(int status, String error, String message, String path) {
		return new ErrorResponse(LocalDateTime.now(), status, error, message, path);
	}
}
