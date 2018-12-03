package com.linkedpipes.lpa.backend.util;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@Profile("!test")
public class DefaultHttpURLConnectionFactory implements HttpURLConnectionFactory {

    @Override
    public HttpURLConnection getConnectionForUrl(String urlString) throws IOException {
        return (HttpURLConnection) new URL(urlString).openConnection();
    }

}
