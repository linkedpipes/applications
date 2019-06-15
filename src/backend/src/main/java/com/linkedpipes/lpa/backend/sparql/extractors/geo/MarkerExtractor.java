package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.entities.geo.Coordinates;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.rdf.vocabulary.Schema;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import java.util.List;
import java.util.Optional;

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

                    /*
                      We want getDouble to fail on NumberFormatException if lat/long aren't valid double values, because
                      that means there is an error in Discovery configuration or in the transformers
                     */
                    Coordinates coords = new Coordinates(
                            geo.getProperty(Schema.latitude).getDouble(),
                            geo.getProperty(Schema.longitude).getDouble());

                    String description = Optional.ofNullable(geoSubject.getProperty(Schema.description))
                            .map(Statement::getString)
                            .orElse(null);

                    LocalizedValue localizedLabel = SparqlUtils.getCombinedLabel(geoSubject, possibleLabels);
                    return new Marker(geoSubject.getURI(), coords, localizedLabel, description);
                })
                .collect(toList());
    }
}

