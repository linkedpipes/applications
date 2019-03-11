package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.HierarchyNode;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Optional;

public class SchemeSubtreeExtractor {

    private static final Property[] labelProperties = {SKOS.prefLabel, RDFS.label, DCTerms.title};

    private final String conceptUri;

    public SchemeSubtreeExtractor(@NotNull String conceptUri) {
        this.conceptUri = conceptUri;
    }

    @NotNull
    public List<HierarchyNode> extract(@NotNull QueryExecution queryExecution) {
        Model model = queryExecution.execConstruct();

        return model
                .listSubjectsWithProperty(RDF.type, SKOS.Concept)
                .mapWith(this::nodeFromConceptResource)
                .toList();
    }

    @NotNull
    private HierarchyNode nodeFromConceptResource(@NotNull Resource resource) {
        String id = resource.getURI();
        LocalizedValue label = SparqlUtils.getCombinedLabel(resource, labelProperties);

        /*String parentId = getParent(resource)
                .map(Resource::getURI)
                .orElse(null);*/

        double size = Optional.ofNullable(resource.getProperty(RDF.value))
                .map(Statement::getDouble)
                .orElse(1.0);

        return new HierarchyNode(id, label, conceptUri, size);
    }

    /*@NotNull
    private Optional<Resource> getParent(@NotNull Resource resource) {
       // if(resource.getURI().equals(conceptUri))
       //     return Optional.empty();

        Optional<Resource> parent = Optional.ofNullable(resource.getProperty(SKOS.broader))
                .or(() -> Optional.ofNullable(resource.getProperty(SKOS.broaderTransitive)))
                .map(Statement::getResource);

        if (!parent.isPresent()) {
            throw new IllegalArgumentException("Concept must have at least one property of {skos:broader, skos:broaderTransitive}");
        }

        return parent;
    }*/

}
