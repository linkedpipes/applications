package com.linkedpipes.lpa.backend.exceptions;

import org.springframework.http.HttpStatus;

public class LpAppsException extends Exception {

    private final HttpStatus errorStatus;

    public LpAppsException(HttpStatus errorCode, String responseMessage) {
        super(responseMessage);
        this.errorStatus = errorCode;
    }

    public LpAppsException(HttpStatus errorCode, String responseMessage, Throwable cause) {
        super(responseMessage, cause);
        this.errorStatus = errorCode;
    }

    public HttpStatus getErrorStatus() {
        return this.errorStatus;
    }
}

