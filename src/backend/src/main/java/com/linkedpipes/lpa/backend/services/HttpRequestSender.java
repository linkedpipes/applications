package com.linkedpipes.lpa.backend.services;

import com.google.gson.Gson;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.ServiceDescription;
import com.linkedpipes.lpa.backend.util.StreamUtils;
import com.linkedpipes.lpa.backend.util.URLUtils;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static java.net.HttpURLConnection.HTTP_OK;

public class HttpRequestSender {

    private static final String HTTP_PROPERTY_KEY_CONTENT_TYPE = "Content-Type";
    private static final String HTTP_PROPERTY_KEY_ACCEPT = "Accept";

    private String targetUrl = null;
    private HttpMethod method = HttpMethod.GET;
    private String requestBody = null;
    private String contentType = null;
    private String acceptType = null;
    private final Map<String, String> parameters = new HashMap<>();

    public HttpRequestSender to(String urlString) {
        targetUrl = urlString;
        return this;
    }

    public DiscoveryActionSelector toDiscovery() {
        return new DiscoveryActionSelector(this);
    }

    public EtlActionSelector toEtl() {
        return new EtlActionSelector(this);
    }

    public HttpRequestSender method(HttpMethod method) {
        this.method = method;
        return this;
    }

    public HttpRequestSender requestBody(String requestBody) {
        this.requestBody = requestBody;
        return this;
    }

    public HttpRequestSender contentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    public HttpRequestSender acceptType(String acceptType) {
        this.acceptType = acceptType;
        return this;
    }

    public HttpRequestSender parameter(String key, String value) {
        parameters.put(key, value);
        return this;
    }

    public HttpRequestSender parameters(Map<String, String> parameters) {
        this.parameters.putAll(parameters);
        return this;
    }

    public String send() throws IOException {
        URL url = new URL(getUrlWithParams());
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod(method.name());
        fillInHeader(connection);
        fillInBody(connection);

        connection.connect();

        if (connection.getResponseCode() != HTTP_OK) {
            throw new ConnectionException(connection.getResponseCode(), connection.getResponseMessage(),
                    StreamUtils.getStringFromStream(connection.getErrorStream()));
        }

        String response = StreamUtils.getStringFromStream(connection.getInputStream());
        connection.disconnect();
        return response;
    }

    private String getUrlWithParams() {
        if (parameters.isEmpty()) {
            return targetUrl;
        }
        return targetUrl + parameters.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
    }

    private void fillInHeader(HttpURLConnection connection) {
        if (contentType != null) {
            connection.setRequestProperty(HTTP_PROPERTY_KEY_CONTENT_TYPE, contentType);
        }
        if (acceptType != null) {
            connection.setRequestProperty(HTTP_PROPERTY_KEY_ACCEPT, acceptType);
        }
    }

    private void fillInBody(HttpURLConnection connection) throws IOException {
        if (requestBody == null) {
            return;
        }
        connection.setDoOutput(true);
        try (DataOutputStream dos = new DataOutputStream(connection.getOutputStream())) {
            dos.writeBytes(requestBody);
        }
    }

    private static class DiscoveryActionSelector {

        private static final String DISCOVERY_BASE_URL = Application.config.getProperty("discoveryServiceUrl");
        private static final String DISCOVERY_START_FROM_INPUT = createDiscoveryUrl("discovery", "startFromInput");
        private static final String DISCOVERY_START_FROM_INPUT_IRI = createDiscoveryUrl("discovery", "startFromInputIri");
        private static final String DISCOVERY_GET_STATUS = createDiscoveryUrl("discovery", "%s");
        private static final String DISCOVERY_GET_PIPELINE_GROUPS = createDiscoveryUrl("discovery", "%s", "pipeline-groups");
        private static final String DISCOVERY_EXPORT_PIPELINE = createDiscoveryUrl("discovery", "%s", "export", "%s");

        private static String createDiscoveryUrl(String... more) {
            return URLUtils.urlFrom(DISCOVERY_BASE_URL, more);
        }

        private final HttpRequestSender sender;

        private DiscoveryActionSelector(HttpRequestSender sender) {
            this.sender = sender;
        }

        public String startFromInput(String discoveryConfig) throws IOException {
            return sender.to(DISCOVERY_START_FROM_INPUT)
                    .method(HttpMethod.POST)
                    .requestBody(discoveryConfig)
                    .contentType("text/plain")
                    .acceptType("application/json")
                    .send();
        }

        public String startFromInputIri(String discoveryConfigIri) throws IOException {
            return sender.to(DISCOVERY_START_FROM_INPUT_IRI)
                    .parameter("iri", discoveryConfigIri)
                    .acceptType("application/json")
                    .send();
        }

        public String getStatus(String discoveryId) throws IOException {
            return sender.to(String.format(DISCOVERY_GET_STATUS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        public String getPipelineGroups(String discoveryId) throws IOException {
            return sender.to(String.format(DISCOVERY_GET_PIPELINE_GROUPS, discoveryId))
                    .acceptType("application/json")
                    .send();
        }

        public String exportPipeline(String discoveryId, String pipelineUri) throws IOException {
            return sender.to(String.format(DISCOVERY_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .acceptType("application/json")
                    .send();
        }

        public String exportPipelineUsingSD(String discoveryId, String pipelineUri, ServiceDescription serviceDescription) throws IOException {
            return sender.to(String.format(DISCOVERY_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .method(HttpMethod.POST)
                    .requestBody(new Gson().toJson(serviceDescription))
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

    }

    private static class EtlActionSelector {

        private EtlActionSelector(HttpRequestSender sender) {
        } // TODO: 24.9.18

    }

    public enum HttpMethod {
        GET, POST
    }

}
