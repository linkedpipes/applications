package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class ThingWithThingWithInstant {
    public String uri;
    public LocalizedValue label;
    public ThingWithInstant objectWithInstant;

    public ThingWithThingWithInstant(String uriIn, ThingWithInstant objectWithInstantIn){
        uri = uriIn;
        objectWithInstant = objectWithInstantIn;
    }

    public ThingWithThingWithInstant(String uriIn, ThingWithInstant objectWithInstantIn, LocalizedValue labelIn){
        uri = uriIn;
        objectWithInstant = objectWithInstantIn;
        label = labelIn;
    }
}
