package com.linkedpipes.lpa.backend.util;

import java.io.IOException;

public class ConnectionException extends IOException {

    public ConnectionException(int errorCode, String responseMessage, String additional) {
        super(getMessage(errorCode, responseMessage, additional));
    }

    public ConnectionException(int errorCode, String responseMessage, String additional, Throwable cause) {
        super(getMessage(errorCode, responseMessage, additional), cause);
    }

    private static String getMessage(int responseCode, String responseMessage, String additional) {
        return responseCode + " " + responseMessage + ": " + additional;
    }
}
