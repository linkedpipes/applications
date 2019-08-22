package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.Date;

public class Interval {
    public String uri;
    public LocalizedValue label;
    public Date start;
    public Date end;

    public Interval(String uriIn, Date startIn, Date endIn){
        uri = uriIn;
        start = startIn;
        end = endIn;
    }

    public Interval(String uriIn, Date startIn, Date endIn, LocalizedValue labelIn){
        uri = uriIn;
        start = startIn;
        end = endIn;
        label = labelIn;
    }
}
