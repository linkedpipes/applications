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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class HighLevelSchemeExtractor {

    private static final Property[] labelProperties = {SKOS.prefLabel, RDFS.label, DCTerms.title};

    private final String schemeUri;

    public HighLevelSchemeExtractor(@NotNull String schemeUri) {
        this.schemeUri = schemeUri;
    }

    @NotNull
    public List<HierarchyNode> extract(@NotNull QueryExecution queryExecution) {
        Model model = queryExecution.execConstruct();

        Resource schemeResource = model.getResource(schemeUri);

        if (schemeResource == null)
            return new ArrayList<>();

        List<HierarchyNode> nodes = new ArrayList<>();
        nodes.add(nodeFromSchemeResource(schemeResource));

        nodes.addAll(model
                .listSubjectsWithProperty(RDF.type, SKOS.Concept)
                .mapWith(this::nodeFromConceptResource)
                .toList());

        return nodes;
    }

    @NotNull
    private HierarchyNode nodeFromSchemeResource(@NotNull Resource schemeResource) {
        LocalizedValue schemeLabel = SparqlUtils.getCombinedLabel(schemeResource, labelProperties);
        if (schemeLabel.size() == 0) {
            String[] splitSchemeUri = schemeUri.split("[/#]");

            String name = splitSchemeUri.length == 0 ? schemeUri : splitSchemeUri[splitSchemeUri.length - 1];
            schemeLabel = new LocalizedValue(LocalizedValue.noLanguageLabel, name);
        }

        return new HierarchyNode(schemeUri, schemeLabel, null, 1.0 );
    }

    @NotNull
    private HierarchyNode nodeFromConceptResource(@NotNull Resource resource) {
        String id = resource.getURI();
        LocalizedValue label = SparqlUtils.getCombinedLabel(resource, labelProperties);

        double size = Optional.ofNullable(resource.getProperty(RDF.value))
                .map(Statement::getDouble)
                .orElse(1.0);

        return new HierarchyNode(id, label, schemeUri, size);
    }
}
