package com.linkedpipes.lpa.backend.entities.timeline;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

import java.util.Date;

public class Instant {
    public String uri;
    public LocalizedValue label;
    public Date date;

    public Instant(String uriIn, Date dateIn){
        uri = uriIn;
        date = dateIn;
    }

    public Instant(String uriIn, Date dateIn, LocalizedValue labelIn){
        uri = uriIn;
        date = dateIn;
        label = labelIn;
    }
}
