package com.linkedpipes.lpa.backend.entities.geo;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;

public class Marker {

    public String uri;
    public Coordinates coordinates;
    public LocalizedValue label;
    public String description;

    public Marker(String uriIn, Coordinates coordinatesIn, LocalizedValue labelIn, String descriptionIn){
        uri = uriIn;
        coordinates = coordinatesIn;
        label = labelIn;
        description = descriptionIn;
    }

    public String toString() {
        return String.format("Marker{uri: \"%s\", coords: \"{%f, %f}\", label: \"%s\", desc: \"%s\"}",
                uri, coordinates.lat, coordinates.lng, label, description);
    }
}
