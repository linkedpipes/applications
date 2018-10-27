package com.linkedpipes.lpa.backend.entities.geo;

import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;

import java.util.Optional;

import static com.linkedpipes.lpa.backend.sparql.queries.geo.MarkerQueryProvider.*;

public class Marker {

    public String uri;
    public Coordinates coordinates;
    public String label;
    public String description;

    public Marker(String uriIn, Coordinates coordinatesIn, String labelIn, String descriptionIn){
        uri = uriIn;
        coordinates = coordinatesIn;
        label = labelIn;
        description = descriptionIn;
    }

    public String toString() {
        return String.format("Marker{uri: \"%s\", coords: \"{%f, %f}\", label: \"%s\", desc: \"%s\"}",
                uri, coordinates.lat, coordinates.lng, label, description);
    }

    public static Marker fromSparqlRow(QuerySolution row) {
        return new Marker(
                row.getResource(VAR_SUBJECT).getURI(),
                new Coordinates(
                        row.getLiteral(VAR_LATITUDE).getDouble(),
                        row.getLiteral(VAR_LONGITUDE).getDouble()),
                Optional.ofNullable(row.getLiteral(VAR_LABEL))
                        .map(Literal::getString)
                        .orElse(null),
                Optional.ofNullable(row.getLiteral(VAR_DESCRIPTION))
                        .map(Literal::getString)
                        .orElse(null));
    }

}
