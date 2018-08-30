package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.controllers.DiscoveryController;
import com.linkedpipes.lpa.backend.helpers.StreamHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpUrlConnector {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    public String sendPostRequest(String url, String postData, String contentType, String acceptType) throws IOException {

        URL obj = new URL(url);

        HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", contentType);
        conn.setRequestProperty("Accept", acceptType);
        conn.setDoOutput(true);

        if(postData != null && !postData.isEmpty()) {
            DataOutputStream wr = new DataOutputStream(conn.getOutputStream());
            wr.writeBytes(postData);
            wr.flush();
            wr.close();
        }

        conn.connect();

        if (conn.getResponseCode() != 200) {
            String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                    + StreamHelper.getStringFromStream(conn.getErrorStream());
            logger.error(errorMsg);
            return errorMsg;
        }

        String response = StreamHelper.getStringFromStream(conn.getInputStream());
        conn.disconnect();
        return response;
    }

    public String sendGetRequest(String url, String params, String acceptType) throws IOException {

        if(params != null){
            url += params;
        }

        URL obj = new URL(url);

        HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", acceptType);
        conn.setDoOutput(true);

        conn.connect();

        if (conn.getResponseCode() != 200) {
            String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                    + StreamHelper.getStringFromStream(conn.getErrorStream());
            logger.error(errorMsg);
            return errorMsg;
        }

        String response = StreamHelper.getStringFromStream(conn.getInputStream());
        conn.disconnect();
        return response;
    }


}
