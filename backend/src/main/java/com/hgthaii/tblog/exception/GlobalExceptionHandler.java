package com.hgthaii.tblog.exception;

import com.hgthaii.tblog.config.AppConstants;
import com.hgthaii.tblog.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global exception handler for all controllers.
 * Provides standardized error responses following REST best practices.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ErrorResponse> handleAuthenticationException(
			AuthenticationException ex,
			HttpServletRequest request) {
		ErrorResponse error = ErrorResponse.of(
				HttpStatus.UNAUTHORIZED.value(),
				"Unauthorized",
				AppConstants.ERR_INVALID_CREDENTIALS,
				request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
			ResourceNotFoundException ex,
			HttpServletRequest request) {
		ErrorResponse error = ErrorResponse.of(
				HttpStatus.NOT_FOUND.value(),
				"Not Found",
				ex.getMessage(),
				request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(DuplicateSlugException.class)
	public ResponseEntity<ErrorResponse> handleDuplicateSlugException(
			DuplicateSlugException ex,
			HttpServletRequest request) {
		ErrorResponse error = ErrorResponse.of(
				HttpStatus.CONFLICT.value(),
				"Conflict",
				ex.getMessage(),
				request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(
			ValidationException ex,
			HttpServletRequest request) {
		ErrorResponse error = ErrorResponse.of(
				HttpStatus.BAD_REQUEST.value(),
				"Bad Request",
				ex.getMessage(),
				request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGlobalException(
			Exception ex,
			HttpServletRequest request) {
		// Log the exception for debugging
		ex.printStackTrace();

		ErrorResponse error = ErrorResponse.of(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error",
				AppConstants.ERR_INTERNAL,
				request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
