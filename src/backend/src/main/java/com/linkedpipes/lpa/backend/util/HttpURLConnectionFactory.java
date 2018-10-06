package com.linkedpipes.lpa.backend.util;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public interface HttpURLConnectionFactory {

    static HttpURLConnectionFactory getDefaultFactory() {
        return urlString -> (HttpURLConnection) new URL(urlString).openConnection();
    }

    HttpURLConnection getConnectionForUrl(String urlString) throws IOException;

}
