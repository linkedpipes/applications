package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

import java.util.*;

//https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/extractor/ConceptsExtractor.scala
public class ConceptsExtractor {
    private final Property[] possibleLinkUris = {SKOS.broader, SKOS.broaderTransitive, SKOS.narrower, SKOS.narrowerTransitive};

    public List<Concept> extract(QueryExecution queryExec){

        List<Concept> concepts = new ArrayList<>();
        Model model = queryExec.execConstruct();
        ResIterator conceptStmtsIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);

        while(conceptStmtsIterator.hasNext()){
            Resource conceptResource = conceptStmtsIterator.next().asResource();

            String label = Optional.of(conceptResource.getProperty(SKOS.prefLabel))
                    .map(lr -> lr.getLiteral())
                    .map(Literal::getString)
                    .orElse(conceptResource.getURI());

            String schemeUri = Optional.of(conceptResource.getProperty(SKOS.inScheme))
                    .map(sr -> sr.getResource().getURI())
                    .orElse(null);

            Map<String, String> linkUris = new HashMap<>();

            Arrays.stream(possibleLinkUris).forEach(l -> {
                    Statement linkResource = Optional.of(conceptResource.getProperty(l)).orElse(null);
                    linkUris.put(l.getURI(), linkResource.getResource().getURI());
            });

            concepts.add(new Concept(conceptResource.getURI(), new LocalizedValue(label), null, schemeUri, linkUris));
        }

        return new ArrayList<>();
    }
}
