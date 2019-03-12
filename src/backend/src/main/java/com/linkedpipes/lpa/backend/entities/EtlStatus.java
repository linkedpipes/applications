package com.linkedpipes.lpa.backend.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import static com.fasterxml.jackson.annotation.JsonCreator.Mode.PROPERTIES;
import static com.fasterxml.jackson.annotation.JsonFormat.Shape.OBJECT;

@JsonFormat(shape = OBJECT)
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

    public static final String SERIALIZED_FIELD_NAME = "@id";

    @NotNull
    @JsonProperty(SERIALIZED_FIELD_NAME)
    private final String etlStatusIri;

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

    @Override
    public String toString() {
        return "EtlStatus{" +
                "etlStatusIri='" + etlStatusIri + '\'' +
                ", pollable=" + pollable +
                '}';
    }

    @NotNull
    @JsonCreator(mode = PROPERTIES)
    public static EtlStatus fromIri(@Nullable @JsonProperty(SERIALIZED_FIELD_NAME) String iri) {
        for (EtlStatus s : EtlStatus.values()) {
            if (s.etlStatusIri.equals(iri)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown status IRI: " + iri);
    }
}
