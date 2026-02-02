# AI Context for tblog

## Project Overview
**tblog** is a lightweight blogging platform built with **Java 25** and **Spring Boot 4**. It allows users to write posts in Markdown, manages authors and categories, and serves content via server-side rendered HTML using **Thymeleaf**.

## Core Goals
- **Simplicity**: Easy to deploy and use.
- **Markdown Support**: Native support for writing posts in Markdown.
- **Lightweight**: Uses SQLite by default for easy file-based data management.
- **Secure**: Implements Spring Security for admin access.

## key Features
- **Public access**: View post lists and details.
- **Admin Panel**: Manage posts (CRUD operations).
- **Authentication**: Form-based login for administrators.
- **Persistence**: SQLite database with JPA/Hibernate.

## Quick Start
- **Run**: `./mvnw spring-boot:run`
- **Database**: `./data/tblog.db` (auto-created)
- **H2 Console**: `/h2` (if enabled in properties)
