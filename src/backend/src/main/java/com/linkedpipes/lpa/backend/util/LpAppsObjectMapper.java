package com.linkedpipes.lpa.backend.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

import java.io.IOException;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

public class LpAppsObjectMapper {

    private static final String GENERIC_ERROR_MESSAGE = "An internal error occurred while processing your request";

    private final ObjectMapper objectMapper;

    public LpAppsObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper.copy();
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

    public <T> T convertValue(Object n, Class<T> valueType) {
        return objectMapper.convertValue(n, valueType);
    }

    public <T> T convertValue(Object fromValue, TypeReference<T> toValueTypeRef) {
        return objectMapper.convertValue(fromValue, toValueTypeRef);
    }

}
