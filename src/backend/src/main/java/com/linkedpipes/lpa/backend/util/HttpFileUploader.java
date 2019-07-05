package com.linkedpipes.lpa.backend.util;

import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.ContentType;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.springframework.http.HttpStatus;
import org.springframework.util.StreamUtils;
import java.io.IOException;
import com.linkedpipes.lpa.backend.Application;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;


public class HttpFileUploader {

    public String uploadTTL(String endpointUrl, String data, String field, String type) throws LpAppsException {
        try {
            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpPost uploadFile = new HttpPost(endpointUrl);
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody(field, data.getBytes(), ContentType.create(type), "input.ttl");
            HttpEntity multipart = builder.build();
            uploadFile.setEntity(multipart);
            CloseableHttpResponse response = httpClient.execute(uploadFile);
            HttpEntity responseEntity = response.getEntity();
            return StreamUtils.copyToString(responseEntity.getContent(), Application.DEFAULT_CHARSET);
        } catch(IOException e) {
            throw new LpAppsException(HttpStatus.INTERNAL_SERVER_ERROR, "Error communicating with external service", e);
        }
    }
}
