package com.linkedpipes.lpa.backend.util;
import com.linkedpipes.lpa.backend.entities.EtlStatusReport;

public interface IExecutionCallback {
    void execute(EtlStatusReport report);
}
