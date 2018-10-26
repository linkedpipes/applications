package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.geo.Coordinate;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.util.NumberParserUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;

import java.util.ArrayList;
import java.util.List;

public class MarkerExtractor {

    public List<Marker> extract(QueryExecution queryExec){
        List<Marker> markers = new ArrayList<>();

        ResultSet result = queryExec.execSelect();

        while (result.hasNext()) {
            QuerySolution qs = result.next();
            markers.add(
                    new Marker(qs.getResource("s").getURI(),
                    new Coordinate(NumberParserUtils.tryParseDouble(qs.getLiteral("lat").getString()), NumberParserUtils.tryParseDouble(qs.getLiteral("lng").getString())),
                            "", ""
                            //TODO extract label and description from queryExec
                    ));
        }

        markers.removeIf(m -> (m.coordinates.lat == null || m.coordinates.lng == null));

        return markers;
    }
}

