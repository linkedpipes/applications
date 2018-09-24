package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.util.StreamUtils;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import static java.net.HttpURLConnection.HTTP_OK;

public class HttpUrlConnector {

    public static String sendPostRequest(String url, String postData, String contentType, String acceptType) throws IOException {
        URL obj = new URL(url);

        HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", contentType);
        conn.setRequestProperty("Accept", acceptType);
        conn.setDoOutput(true);

        if(postData != null && !postData.isEmpty()) {
            try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
                wr.writeBytes(postData);
                wr.flush();
            }
        }

        conn.connect();

        if (conn.getResponseCode() != HTTP_OK) {
            throw new ConnectionException(conn.getResponseCode(), conn.getResponseMessage(), StreamUtils.getStringFromStream(conn.getErrorStream()));
        }

        String response = StreamUtils.getStringFromStream(conn.getInputStream());
        conn.disconnect();
        return response;
    }

    public static String sendGetRequest(String url, String params, String acceptType) throws IOException {
        if (params != null) {
            url += params;
        }

        URL obj = new URL(url);

        HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", acceptType);
        conn.setDoOutput(true);

        conn.connect();

        if (conn.getResponseCode() != HTTP_OK) {
            throw new ConnectionException(conn.getResponseCode(), conn.getResponseMessage(), StreamUtils.getStringFromStream(conn.getErrorStream()));
        }

        String response = StreamUtils.getStringFromStream(conn.getInputStream());
        conn.disconnect();
        return response;
    }


}
