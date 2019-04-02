package com.linkedpipes.lpa.backend.exceptions;

import java.io.IOException;

public class PipelineNotFoundException extends IOException {
    public PipelineNotFoundException(String pipelineId) {
        super(pipelineId);
    }
}
