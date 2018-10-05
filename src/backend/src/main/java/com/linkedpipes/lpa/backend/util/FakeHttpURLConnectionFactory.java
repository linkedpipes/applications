package com.linkedpipes.lpa.backend.util;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class FakeHttpURLConnectionFactory implements HttpURLConnectionFactory {

    @Override
    public FakeHttpURLConnection getConnectionForUrl(String urlString) throws MalformedURLException {
        return new FakeHttpURLConnection(new URL(urlString));
    }

    public static class FakeHttpURLConnection extends HttpURLConnection {

        private FakeHttpURLConnection(URL u) {
            super(u);
        }

        @Override
        public void disconnect() {
        }

        @Override
        public boolean usingProxy() {
            return false;
        }

        @Override
        public void connect() {
        }

    }

}
