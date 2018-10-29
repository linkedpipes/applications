package com.linkedpipes.lpa.backend.services.geo;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.entities.geo.Polygon;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import com.linkedpipes.lpa.backend.sparql.extractors.geo.MarkerExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.geo.MarkerQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

//synonymous to https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/geo/GeoServiceImpl.scala
public class GeoService {

    private static final String ENDPOINT = Application.getConfig().getProperty("sparqlEndpoint");

    public static List<Marker> getMarkers(Map<String, List<ValueFilter>> filters) {
        if (filters == null) {
            filters = Collections.emptyMap();
        }

        SparqlQueryProvider provider = new MarkerQueryProvider(filters);
        return MarkerExtractor.extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    public List<Polygon> getPolygons(){
        return new ArrayList<>();
    }

}
