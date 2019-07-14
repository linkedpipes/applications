package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class ThingWithThingWithInterval {
    public String uri;
    public LocalizedValue label;
    public ThingWithInterval objectWithInterval;

    public ThingWithThingWithInterval(String uriIn, ThingWithInterval objectWithIntervalIn){
        uri = uriIn;
        objectWithInterval = objectWithIntervalIn;
    }

    public ThingWithThingWithInterval(String uriIn, ThingWithInterval objectWithIntervalIn, LocalizedValue labelIn){
        uri = uriIn;
        objectWithInterval = objectWithIntervalIn;
        label = labelIn;
    }
}
