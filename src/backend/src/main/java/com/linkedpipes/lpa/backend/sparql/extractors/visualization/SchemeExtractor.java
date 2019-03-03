package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.HierarchyNode;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
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

public class SchemeExtractor {

    private static final Property[] labelProperties = {SKOS.prefLabel, RDFS.label, DCTerms.title};

    private final String schemeUri;

    public SchemeExtractor(@NotNull String schemeUri) {
        this.schemeUri = schemeUri;
    }

    @NotNull
    public List<HierarchyNode> extract(@NotNull QueryExecution queryExecution) {
        return queryExecution.execConstruct()
                .listSubjects()
                //.filterKeep(s -> s.hasProperty(RDF.type, SKOS.Concept) || s.hasProperty(RDF.type, SKOS.ConceptScheme))
                .mapWith(this::nodeFromResource)
                .toList();
    }

    @NotNull
    private HierarchyNode nodeFromResource(@NotNull Resource resource) {
        String id = resource.getURI();
        LocalizedValue label = SparqlUtils.getCombinedLabel(resource, labelProperties);

        String parentId = getParent(resource)
                .map(Resource::getURI)
                .orElse(null);

        //TODO should this be integer?
        double size = Optional.ofNullable(resource.getProperty(RDF.value))
                .map(Statement::getDouble)
                .orElse(1.0);

        return new HierarchyNode(id, label, parentId, size);
    }

    @NotNull
    private Optional<Resource> getParent(@NotNull Resource resource) {
        Resource childType = resource.getRequiredProperty(RDF.type).getResource();
        if (childType.equals(SKOS.ConceptScheme)) {
            return Optional.empty();
        }
        if (!childType.equals(SKOS.Concept)) {
            throw new IllegalArgumentException("Resource must be of type Concept or ConceptScheme, actual type: " + childType);
        }

        Optional<Resource> parent = Optional.ofNullable(resource.getProperty(SKOS.topConceptOf))
                .or(() -> Optional.ofNullable(resource.getProperty(SKOS.broader)))
                .or(() -> Optional.ofNullable(resource.getProperty(SKOS.broaderTransitive)))
                .map(Statement::getResource);

        if (!parent.isPresent()) {
            throw new IllegalArgumentException("Concept must have at least one property of {skos:topConceptOf, skos:broader, skos:broaderTransitive}");
        }

        return parent;
    }

}
