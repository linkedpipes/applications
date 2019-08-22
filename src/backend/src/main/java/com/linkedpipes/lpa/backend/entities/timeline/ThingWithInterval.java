package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class ThingWithInterval {
    public String uri;
    public LocalizedValue label;
    public Interval interval;

    public ThingWithInterval(String uriIn, Interval intervalIn){
        uri = uriIn;
        interval = intervalIn;
    }

    public ThingWithInterval(String uriIn, Interval intervalIn, LocalizedValue labelIn){
        uri = uriIn;
        interval = intervalIn;
        label = labelIn;
    }
}
