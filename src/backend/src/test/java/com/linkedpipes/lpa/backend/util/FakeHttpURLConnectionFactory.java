package com.linkedpipes.lpa.backend.util;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toCollection;

@Service
@Profile("test")
public class FakeHttpURLConnectionFactory implements HttpURLConnectionFactory {

    private FakeHttpURLConnection lastConnection;

    @Override
    public FakeHttpURLConnection getConnectionForUrl(String urlString) throws MalformedURLException {
        return lastConnection = new FakeHttpURLConnection(new URL(urlString));
    }

    FakeHttpURLConnection getLastConnection() {
        return lastConnection;
    }

    public static class FakeHttpURLConnection extends HttpURLConnection {

        private Map<String, List<String>> requestProperties = new HashMap<>();
        private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        private FakeHttpURLConnection(URL u) {
            super(u);
        }

        @Override
        public int getResponseCode() {
            return HTTP_OK;
        }

        @Override
        public String getResponseMessage() {
            return "OK";
        }

        @Override
        public InputStream getErrorStream() {
            return StreamUtils.emptyInput();
        }

        @Override
        public InputStream getInputStream() {
            return StreamUtils.emptyInput();
        }

        @Override
        public ByteArrayOutputStream getOutputStream() {
            return outputStream;
        }

        @Override
        public void setDoInput(boolean doInput) {
        }

        @Override
        public boolean getDoInput() {
            return true;
        }

        @Override
        public void setDoOutput(boolean doOutput) {
        }

        @Override
        public boolean getDoOutput() {
            return true;
        }

        @Override
        public void setRequestProperty(String key, String value) {
            requestProperties.put(key, Stream.of(value).collect(toCollection(ArrayList::new)));
        }

        @Override
        public void addRequestProperty(String key, String value) {
            if (!requestProperties.containsKey(key)) {
                setRequestProperty(key, value);
                return;
            }
            requestProperties.get(key).add(value);
        }

        @Override
        public String getRequestProperty(String key) {
            if (!requestProperties.containsKey(key)) {
                return null;
            }
            List<String> value = requestProperties.get(key);
            return value.get(value.size() - 1);
        }

        @Override
        public Map<String, List<String>> getRequestProperties() {
            return Collections.unmodifiableMap(requestProperties);
        }

        @Override
        public void connect() {
        }

        @Override
        public boolean usingProxy() {
            return false;
        }

        @Override
        public void disconnect() {
        }

    }

}
