package com.linkedpipes.lpa.backend.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

import java.io.IOException;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

/**
 * This {@link ObjectMapper} wrapper has {@link DeserializationFeature#FAIL_ON_UNKNOWN_PROPERTIES} disabled by default.
 * Use the {@link #configure(DeserializationFeature, boolean)} delegate method to override this behavior.
 */
public class LpAppsObjectMapper {

    private static final String GENERIC_ERROR_MESSAGE = "An internal error occurred while processing your request";

    private final ObjectMapper objectMapper;

    public LpAppsObjectMapper() {
        this(new ObjectMapper());
    }

    public LpAppsObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper
                .copy()
                .disable(FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public <T> T readValue(String content, Class<T> valueType) throws LpAppsException {
        try {
            return objectMapper.readValue(content, valueType);
        } catch (IOException e) {
            throw new LpAppsException(INTERNAL_SERVER_ERROR, GENERIC_ERROR_MESSAGE, e);
        }
    }

    public <T> T readValue(String content, TypeReference valueTypeRef) throws LpAppsException {
        try {
            return objectMapper.readValue(content, valueTypeRef);
        } catch (IOException e) {
            throw new LpAppsException(INTERNAL_SERVER_ERROR, GENERIC_ERROR_MESSAGE, e);
        }
    }

    public String writeValueAsString(Object value) throws LpAppsException {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new LpAppsException(INTERNAL_SERVER_ERROR, GENERIC_ERROR_MESSAGE, e);
        }
    }

    public <T> T convertValue(Object n, Class<T> valueType) {
        return objectMapper.convertValue(n, valueType);
    }

    public <T> T convertValue(Object fromValue, TypeReference<T> toValueTypeRef) {
        return objectMapper.convertValue(fromValue, toValueTypeRef);
    }

    public LpAppsObjectMapper configure(DeserializationFeature feature, boolean state) {
        objectMapper.configure(feature, state);
        return this;
    }

}
