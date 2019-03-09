package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.linkedpipes.lpa.backend.util.EtlStatusDeserializer;
import com.linkedpipes.lpa.backend.util.EtlStatusSerializer;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@JsonSerialize(using = EtlStatusSerializer.class)
@JsonDeserialize(using = EtlStatusDeserializer.class)
public enum EtlStatus {
    QUEUED("http://etl.linkedpipes.com/resources/status/queued", true),
    MAPPED("http://etl.linkedpipes.com/resources/status/mapped", true),
    INITIALIZING("http://etl.linkedpipes.com/resources/status/initializing", true),
    RUNNING("http://etl.linkedpipes.com/resources/status/running", true),
    FINISHED("http://etl.linkedpipes.com/resources/status/finished", false),
    CANCELLED("http://etl.linkedpipes.com/resources/status/cancelled", false),
    CANCELLING("http://etl.linkedpipes.com/resources/status/cancelling", false),
    FAILED("http://etl.linkedpipes.com/resources/status/failed", false),
    UNKNOWN("http://etl.linkedpipes.com/resources/status/unknown", false);

    @NotNull @JsonProperty("@id")
    private String etlStatusIri;

    @JsonIgnore private boolean pollable;

    EtlStatus(@NotNull String statusIri, boolean isPollable) {
        this.etlStatusIri = statusIri;
        this.pollable = isPollable;
    }

    @NotNull
    public String getStatusIri() {
        return this.etlStatusIri;
    }

    public boolean isPollable() {
        return this.pollable;
    }

    @NotNull
    public static EtlStatus fromIri(@Nullable String iri) {
        for (EtlStatus s : EtlStatus.values()) {
            if (s.etlStatusIri.equals(iri)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown status IRI: " + iri);
    }
}
