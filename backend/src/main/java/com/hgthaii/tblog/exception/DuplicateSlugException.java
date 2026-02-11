package com.hgthaii.tblog.exception;

/**
 * Exception thrown when attempting to create an entity with a duplicate slug.
 */
public class DuplicateSlugException extends RuntimeException {

	public DuplicateSlugException(String message) {
		super(message);
	}

	public DuplicateSlugException(String message, Throwable cause) {
		super(message, cause);
	}
}
