package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import org.springframework.util.StreamUtils;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import static java.net.HttpURLConnection.HTTP_OK;

/**
 * A builder for HTTP requests. Some settings of the builder are mandatory. If any mandatory setting is not provided,
 * the {@link #send()} method throws {@link IllegalStateException}.
 */
public class HttpRequestSender {

    private static final String HTTP_PROPERTY_KEY_CONTENT_TYPE = "Content-Type";
    private static final String HTTP_PROPERTY_KEY_ACCEPT = "Accept";

    private String targetUrl = null;
    private HttpMethod method = HttpMethod.GET;
    private String requestBody = null;
    private String contentType = null;
    private String acceptType = null;
    private final UrlParameters parameters = new UrlParameters();

    /**
     * Sets the target URL to connect to. This setting is mandatory.
     *
     * @param urlString the target URL
     * @return this
     */
    public HttpRequestSender to(String urlString) {
        targetUrl = urlString;
        return this;
    }

    /**
     * Delegates the builder to a {@link DiscoveryActionSelector} which is an {@link HttpActionSelector} for selecting
     * actions specific to the Discovery tool.
     *
     * @return a {@link DiscoveryActionSelector} operating on this builder
     */
    public DiscoveryActionSelector toDiscovery() {
        return new DiscoveryActionSelector(this);
    }

    /**
     * Delegates the builder to an {@link EtlActionSelector} which is an {@link HttpActionSelector} for selecting
     * actions specific to the ETL tool.
     *
     * @return a {@link EtlActionSelector} operating on this builder
     */
    public EtlActionSelector toEtl() {
        return new EtlActionSelector(this);
    }

    /**
     * Sets the HTTP method to use for this request. This setting is optional. The default is {@link HttpMethod#GET}.
     *
     * @param method the desired HTTP method
     * @return this
     */
    public HttpRequestSender method(HttpMethod method) {
        this.method = method;
        return this;
    }

    /**
     * Sets the body to use for this request. This setting is optional.
     *
     * @param requestBody the desired request body
     * @return this
     */
    public HttpRequestSender requestBody(String requestBody) {
        this.requestBody = requestBody;
        return this;
    }

    /**
     * Sets the {@code Content-Type} request property. This setting is optional.
     *
     * @param contentType the desired value of the {@code Content-Type} request property
     * @return this
     */
    public HttpRequestSender contentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    /**
     * Sets the {@code Accept} request property. This setting is optional.
     *
     * @param acceptType the desired value of the {@code Accept} request property
     * @return this
     */
    public HttpRequestSender acceptType(String acceptType) {
        this.acceptType = acceptType;
        return this;
    }

    /**
     * Adds a key-value pair to the list of the GET parameters for this request. If the key has already been mapped to a
     * value before, the previous value is overridden. The list of parameters is appended to the target URL regardless
     * of the request method.
     *
     * @param key   the key to map to a value
     * @param value the mapped value
     * @return this
     */
    public HttpRequestSender parameter(String key, String value) {
        parameters.put(key, value);
        return this;
    }

    /**
     * Generates and sends the HTTP request, obtaining a {@link HttpURLConnection connection} from the given factory.
     *
     * @param factory factory for the connection object
     * @return the body of the response obtained by the request
     * @throws IOException           if an I/O error occurs
     * @throws IllegalStateException if a mandatory setting has not been set for this builder
     */
    public String send(HttpURLConnectionFactory factory) throws IOException {
        checkMandatorySettings();
        HttpURLConnection connection = factory.getConnectionForUrl(getUrlWithParameters());

        connection.setRequestMethod(method.name());
        fillInHeader(connection);
        fillInBody(connection);

        if (connection.getResponseCode() != HTTP_OK) {
            try (InputStream errorStream = connection.getErrorStream()) {
                int responseCode = connection.getResponseCode();
                String responseMessage = connection.getResponseMessage();
                String responseBody = StreamUtils.copyToString(errorStream, Application.DEFAULT_CHARSET);
                throw new ConnectionException(responseCode, responseMessage, responseBody);
            }
        }

        try (InputStream inputStream = connection.getInputStream()) {
            return StreamUtils.copyToString(inputStream, Application.DEFAULT_CHARSET);
        }
    }

    /**
     * Generates and sends the HTTP request, obtaining a {@link HttpURLConnection connection} from the {@link
     * HttpURLConnectionFactory#getDefault() default factory}.
     *
     * @return the body of the response obtained by the request
     * @throws IOException           if an I/O error occurs
     * @throws IllegalStateException if a mandatory setting has not been set for this builder
     */
    public String send() throws IOException {
        return send(HttpURLConnectionFactory.getDefault());
    }

    private void checkMandatorySettings() {
        if (targetUrl == null) {
            throw new IllegalStateException("Target URL was not set");
        }
    }

    private String getUrlWithParameters() {
        return targetUrl + parameters.toString();
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

    public static class DiscoveryActionSelector extends HttpActionSelector {

        private final String DISCOVERY_START_FROM_INPUT = createUrl("discovery", "startFromInput");
        private final String DISCOVERY_START_FROM_INPUT_IRI = createUrl("discovery", "startFromInputIri");
        private final String DISCOVERY_GET_STATUS = createUrl("discovery", "%s");
        private final String DISCOVERY_GET_PIPELINE_GROUPS = createUrl("discovery", "%s", "pipeline-groups");
        private final String DISCOVERY_EXPORT_PIPELINE = createUrl("discovery", "%s", "export", "%s");

        private DiscoveryActionSelector(HttpRequestSender sender) {
            super(sender, Application.config.getProperty("discoveryServiceUrl"));
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

        public String exportPipelineUsingSD(String discoveryId, String pipelineUri, String serviceDescription) throws IOException {
            return sender.to(String.format(DISCOVERY_EXPORT_PIPELINE, discoveryId, pipelineUri))
                    .method(HttpMethod.POST)
                    .requestBody(serviceDescription)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

    }

    public static class EtlActionSelector extends HttpActionSelector {

        private final String ETL_EXECUTE_PIPELINE = createUrl("executions");


        private EtlActionSelector(HttpRequestSender sender) {
            super(sender, Application.config.getProperty("etlServiceUrl"));
        }

        public String executePipeline(String pipelineIri) throws IOException {
            return sender.to(ETL_EXECUTE_PIPELINE)
                    .parameter("pipeline", pipelineIri)
                    .method(HttpMethod.POST)
                    .contentType("application/json")
                    .acceptType("application/json")
                    .send();
        }

        public String getExecutionStatus(String executionIri) throws IOException {
            String targetUrl = UrlUtils.urlFrom(executionIri, "overview");
            return sender.to(targetUrl)
                    .acceptType("application/json")
                    .send();
        }

        public String getExecutionResult(String executionIri) throws IOException {
            return sender.to(executionIri)
                    .acceptType("application/json")
                    .send();
        }

    }

    public static class UrlParameters extends LinkedHashMap<String, String> {

        @Override
        public String put(String key, String value) {
            if (key == null) {
                throw new NullPointerException("URL parameter key cannot be null");
            }
            if (value == null) {
                throw new NullPointerException("URL parameter value cannot be null");
            }
            return super.put(key, value);
        }

        @Override
        public String toString() {
            if (isEmpty()) {
                return "";
            }
            return "?" + entrySet().stream()
                    .map(entry -> entry.getKey() + "=" + entry.getValue())
                    .collect(Collectors.joining("&"));
        }

    }

    public enum HttpMethod {
        GET, POST
    }

}
