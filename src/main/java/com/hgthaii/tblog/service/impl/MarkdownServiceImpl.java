package com.hgthaii.tblog.service.impl;

import com.hgthaii.tblog.service.MarkdownService;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

@Service("markdownService")
public class MarkdownServiceImpl implements MarkdownService {
    private final Parser parser = Parser.builder().build();
    private final HtmlRenderer renderer = HtmlRenderer.builder().build();

    @Override
    public String render(String markdown) {
        Node document = parser.parse(markdown);
        return renderer.render(document);
    }
}
