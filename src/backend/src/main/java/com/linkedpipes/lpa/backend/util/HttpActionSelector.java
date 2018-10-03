package com.linkedpipes.lpa.backend.util;

public abstract class HttpActionSelector {

    protected final HttpRequestSender sender;
    private final String baseUrl;

    public HttpActionSelector(HttpRequestSender sender, String baseUrl) {
        this.sender = sender;
        this.baseUrl = baseUrl;
    }

    protected final String createUrl(String... more) {
        return UrlUtils.urlFrom(baseUrl, more);
    }

}
