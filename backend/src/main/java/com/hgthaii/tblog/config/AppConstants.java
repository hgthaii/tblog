package com.hgthaii.tblog.config;

public class AppConstants {
	// API Versioning
	public static final String API_V1 = "/api/v1";

	// Error Messages
	public static final String ERR_UNAUTHORIZED = "Unauthorized access";
	public static final String ERR_INVALID_CREDENTIALS = "Invalid username or password";
	public static final String ERR_NOT_FOUND = "Resource not found";
	public static final String ERR_INTERNAL = "An unexpected error occurred system-wide";

	// Default Values
	public static final String DEFAULT_PAGE_NUMBER = "1";
	public static final String DEFAULT_PAGE_SIZE = "10";
	public static final String DEFAULT_SORT_BY = "createdAt";
	public static final String DEFAULT_SORT_DIRECTION = "desc";
}
