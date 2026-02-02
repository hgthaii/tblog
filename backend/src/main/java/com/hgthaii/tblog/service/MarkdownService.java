package com.hgthaii.tblog.service;

import org.springframework.stereotype.Service;

@Service
public interface MarkdownService {
    String render(String markdown);
}
