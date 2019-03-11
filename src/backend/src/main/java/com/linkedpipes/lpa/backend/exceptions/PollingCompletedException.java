package com.linkedpipes.lpa.backend.exceptions;

public class PollingCompletedException extends RuntimeException {
    public PollingCompletedException() {
        super();
    }

    public PollingCompletedException(Exception e) {
        super(e);
    }
}
