package com.linkedpipes.lpa.backend.entities;

import com.google.gson.annotations.SerializedName;

public class DataSource {

    //TODO use a custom URI object class instead of String type, and use class to automatically validate uri
    @SerializedName("iri")
    public String Uri;

    @SerializedName("label")
    public String Label;
}
