package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.geo.Coordinates;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Literal;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Spliterator;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.linkedpipes.lpa.backend.sparql.queries.geo.MarkerQueryProvider.*;
import static java.util.Spliterator.*;
import static java.util.Spliterators.spliteratorUnknownSize;

public class MarkerExtractor {

    public static List<Marker> extract(QueryExecution queryExec){
        ResultSet result = queryExec.execSelect();

        Spliterator<QuerySolution> spliterator =
                spliteratorUnknownSize(result, ORDERED | DISTINCT | NONNULL | IMMUTABLE);

        return StreamSupport.stream(spliterator, false)
                .map(MarkerExtractor::extractMarker)
                .filter(m -> m.coordinates.lat != null && m.coordinates.lng != null)
                .collect(Collectors.toList());
    }

    private static Marker extractMarker(QuerySolution row) {
        return new Marker(
                row.getResource(VAR_SUBJECT).getURI(),
                new Coordinates(
                        row.getLiteral(VAR_LATITUDE).getDouble(),
                        row.getLiteral(VAR_LONGITUDE).getDouble()),
                //for label, pick any one of the values for LABEL_VARIABLES (if any of them is set, otherwise null)
                Arrays.stream(LABEL_VARIABLES)
                        .filter(row::contains)
                        .findFirst()
                        .map(row::getLiteral)
                        .map(Literal::getString)
                        .orElse(null),
                Optional.of(VAR_DESCRIPTION)
                        .map(row::getLiteral)
                        .map(Literal::getString)
                        .orElse(null));
    }

}

