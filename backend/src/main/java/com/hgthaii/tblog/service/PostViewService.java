package com.hgthaii.tblog.service;

import org.springframework.stereotype.Service;

@Service
public interface PostViewService {
    int readingTime(String content);
    String excerpt(String content);
}
