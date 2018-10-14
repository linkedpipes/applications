package com.linkedpipes.lpa.backend.util;

public abstract class HttpActionSelector {

    protected final HttpRequestSender sender;

    public HttpActionSelector(HttpRequestSender sender) {
        this.sender = sender;
    }

}
