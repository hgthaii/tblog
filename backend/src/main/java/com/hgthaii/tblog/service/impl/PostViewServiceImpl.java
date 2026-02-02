package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.service.PostViewService;
import org.springframework.stereotype.Service;

@Service("postViewService")
public class PostViewServiceImpl implements PostViewService {
    
    @Override
    public int readingTime(String content) {
        if (content == null || content.isBlank()) return 1;

        int words = content.trim().split("\\s+").length;
        return Math.max(1, words / 200);
    }

    @Override
    public String excerpt(String content) {
        if (content == null || content.isBlank()) return content;

        String text = content
                .replaceAll("#+", "")
                .replaceAll("[*_>`]", "")
                .replaceAll("\\n+", " ")
                .trim();

        if (text.length() < 140) return text;
        return text.substring(0, 140) + "...";
    }
}
