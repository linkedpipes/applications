package com.linkedpipes.lpa.backend.util;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * A factory for {@link HttpURLConnection} objects and their fake subclasses to make testing easier.
 */
public interface HttpURLConnectionFactory {

    /**
     * Create a default factory which produces true connections.
     *
     * @return a factory which produces actual true connection objects.
     */
    static HttpURLConnectionFactory getDefaultFactory() {
        return urlString -> (HttpURLConnection) new URL(urlString).openConnection();
    }

    /**
     * Create an {@link HttpURLConnection} object which tries to connect to a given URL.
     *
     * @param urlString the URL string to conect to
     * @return a connection pointing to {@code urlString}
     * @throws IOException if the URL string is malformed or creating a connection object fails
     */
    HttpURLConnection getConnectionForUrl(String urlString) throws IOException;

}
