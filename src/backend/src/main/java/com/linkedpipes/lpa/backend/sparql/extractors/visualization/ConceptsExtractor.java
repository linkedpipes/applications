package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/extractor/ConceptsExtractor.scala
public class ConceptsExtractor {
    private final Property[] possibleLinkUris = {SKOS.broader, SKOS.broaderTransitive, SKOS.narrower, SKOS.narrowerTransitive};

    public List<Concept> extract(QueryExecution queryExec){

        List<Concept> concepts = new ArrayList<>();
        Model model = queryExec.execConstruct();
        ResIterator resIter = model.listResourcesWithProperty(RDF.type, SKOS.Concept);

        while(resIter.hasNext()){
            Resource conceptResource = resIter.next().asResource();

            String label = Optional.of(conceptResource.getProperty(SKOS.prefLabel))
                    .map(lr -> lr.getLiteral())
                    .map(Literal::getString)
                    .orElse(conceptResource.getURI());

            String schemeUri = Optional.of(conceptResource.getProperty(SKOS.inScheme))
                    .map(sr -> sr.getResource().getURI())
                    .orElse(null);

            //TODO fix below linkUris extration logic.. should return map?
            List<String> linkUris = Arrays.stream(possibleLinkUris).flatMap(l -> {
                return Optional.of(conceptResource.getProperty(l))
                    .map(s-> s.getResource().getURI()).stream();
                    //.orElse(null);
            }).collect(Collectors.toList());

            concepts.add(new Concept(conceptResource.getURI(), label, null, schemeUri, null));
        }

        return new ArrayList<>();
    }
}
