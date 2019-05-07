package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.geo.Coordinates;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Schema;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import java.util.*;
import static java.util.stream.Collectors.toList;

public class MarkerExtractor {

    private final Property[] possibleLabels = {SKOS.prefLabel, RDFS.label, SKOS.notation, Schema.name};

    public List<Marker> extract(QueryExecution queryExec) {
        Model model = queryExec.execConstruct();

        return model.listResourcesWithProperty(Schema.geo)
                .toList()
                .stream()
                .map(geoSubject -> {

                    Resource geo = geoSubject.getPropertyResourceValue(Schema.geo);

                    //TODO check what happens in case getDouble fails because lat/long aren't valid double values... fix the filter condition below if necessary
                    Coordinates coords = new Coordinates(
                            geo.getProperty(Schema.latitude).getDouble(),
                            geo.getProperty(Schema.longitude).getDouble());

                    String description = Optional.ofNullable(geoSubject.getProperty(Schema.description)).map(d -> d.getString()).orElse(null);

                    LocalizedValue localizedLabel = SparqlUtils.getCombinedLabel(geoSubject, possibleLabels);
                    return new Marker(geoSubject.getURI(), coords, localizedLabel, description);
                })
                // Skip markers with invalid coordinates
                .filter(m -> m.coordinates.lat != null && m.coordinates.lng != null)
                .collect(toList());
    }
}

