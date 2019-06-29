package com.linkedpipes.lpa.backend.services.geo;

import com.linkedpipes.lpa.backend.entities.MarkerFilterSetup;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.entities.geo.Polygon;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import com.linkedpipes.lpa.backend.sparql.extractors.geo.GeoPropertiesExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.geo.MarkerExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.geo.GeoPropertiesQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.geo.MarkerQueryProvider;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//synonymous to https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/geo/GeoServiceImpl.scala
@Service
public class GeoService {

    public static List<Marker> getMarkers(String graphIri, Map<String, List<ValueFilter>> filters) throws LpAppsException {
        ConstructSparqlQueryProvider provider = new MarkerQueryProvider(filters);
        System.out.println(provider.get(graphIri));
        return JenaUtils.withQueryExecution(provider.get(graphIri), new MarkerExtractor()::extract);
    }

    public static MarkerFilterSetup getProperties(String graphIri) throws LpAppsException {
        SelectSparqlQueryProvider provider = new GeoPropertiesQueryProvider();
        return JenaUtils.withQueryExecution(provider.get(graphIri), new GeoPropertiesExtractor()::extract);
    }

    public List<Polygon> getPolygons(){
        return new ArrayList<>();
    }

}
