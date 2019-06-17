package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class ThingWithInstant {
    public String uri;
    public LocalizedValue label;
    public Instant instant;

    public ThingWithInstant(String uriIn, Instant instantIn){
        uri = uriIn;
        instant = instantIn;
    }

    public ThingWithInstant(String uriIn, Instant instantIn, LocalizedValue labelIn){
        uri = uriIn;
        instant = instantIn;
        label = labelIn;
    }
}
