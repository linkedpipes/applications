package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

import java.util.*;

import static java.util.stream.Collectors.toMap;

//https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/extractor/ConceptsExtractor.scala
public class ConceptsExtractor {
    private final Property[] possibleLinkUris = {SKOS.broader, SKOS.broaderTransitive, SKOS.narrower, SKOS.narrowerTransitive};

    public List<Concept> extract(QueryExecution queryExec){

        List<Concept> concepts = new ArrayList<>();
        Model model = queryExec.execConstruct();
        ResIterator conceptStmtsIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);

        while (conceptStmtsIterator.hasNext()) {
            Resource conceptResource = conceptStmtsIterator.next().asResource();

            String label = Optional.ofNullable(conceptResource.getProperty(SKOS.prefLabel))
                    .map(Statement::getLiteral)
                    .map(Literal::getString)
                    .orElse(conceptResource.getURI());

            String schemeUri = Optional.ofNullable(conceptResource.getProperty(SKOS.inScheme))
                    .map(Statement::getResource)
                    .map(Resource::getURI)
                    .orElse(null);

            Map<String, String> linkUris = Arrays.stream(possibleLinkUris)
                    .map(linkUri -> Optional.ofNullable(conceptResource.getProperty(linkUri))
                            .map(stmt -> Map.entry(linkUri.getURI(), stmt.getResource().getURI())))
                    .flatMap(Optional::stream)
                    .collect(toMap(Map.Entry::getKey, Map.Entry::getValue));

            concepts.add(new Concept(conceptResource.getURI(), new LocalizedValue(label), null, schemeUri, linkUris));
        }

        return concepts;
    }
}
