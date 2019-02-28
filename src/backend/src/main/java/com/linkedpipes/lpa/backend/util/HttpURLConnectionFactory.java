package com.linkedpipes.lpa.backend.util;

import java.io.IOException;
import java.net.HttpURLConnection;

/**
 * A factory for {@link HttpURLConnection} objects and their fake subclasses to make testing easier.
 */
public interface HttpURLConnectionFactory {

    /**
     * Create an {@link HttpURLConnection} object which tries to connect to a given URL.
     *
     * @param urlString the URL string to connect to
     * @return a connection pointing to {@code urlString}
     * @throws IOException if the URL string is malformed or creating a connection object fails
     */
    HttpURLConnection getConnectionForUrl(String urlString) throws IOException;

}
