package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.geo.Marker;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;

import java.util.List;
import java.util.Spliterator;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.util.Spliterator.*;
import static java.util.Spliterators.spliteratorUnknownSize;

public class MarkerExtractor {

    public static List<Marker> extract(QueryExecution queryExec){
        ResultSet result = queryExec.execSelect();

        Spliterator<QuerySolution> spliterator =
                spliteratorUnknownSize(result, ORDERED | DISTINCT | NONNULL | IMMUTABLE);

        return StreamSupport.stream(spliterator, false)
                .map(Marker::fromSparqlRow)
                .filter(m -> m.coordinates.lat != null && m.coordinates.lng != null)
                .collect(Collectors.toList());
    }

}

