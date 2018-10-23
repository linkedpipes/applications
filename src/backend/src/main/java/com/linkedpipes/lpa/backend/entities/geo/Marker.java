package com.linkedpipes.lpa.backend.entities.geo;

public class Marker {
    public String uri;
    public Coordinate coordinates;
    public String label;
    public String description;

    public Marker(String uriIn, Coordinate coordinatesIn, String labelIn, String descriptionIn){
        uri = uriIn;
        coordinates = coordinatesIn;
        label = labelIn;
        description = descriptionIn;
    }
}
