package com.linkedpipes.lpa.backend.entities.geo;

public class Marker {
    public String uri;
    public Coordinate coordinates;
    public String title;
    public String description;

    public Marker(String uriIn, Coordinate coordinatesIn){
        uri = uriIn;
        coordinates = coordinatesIn;
    }
}
