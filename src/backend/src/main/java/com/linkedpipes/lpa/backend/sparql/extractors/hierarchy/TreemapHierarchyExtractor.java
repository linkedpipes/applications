package com.linkedpipes.lpa.backend.sparql.extractors.hierarchy;

import com.linkedpipes.lpa.backend.entities.hierarchy.TreemapNode;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

public class TreemapHierarchyExtractor {

    public List<TreemapNode> extract(QueryExecution queryExecution) {
        return queryExecution.execConstruct()
                .listSubjects()
                .mapWith(this::nodeFromResource)
                .toList();
    }

    @NotNull
    private TreemapNode nodeFromResource(@NotNull Resource resource) {
        String id = getLabelCombined(resource);
        Resource parent = Optional.ofNullable(resource.getProperty(SKOS.broader))
                .map(Statement::getResource)
                .orElse(null);
        String parentId = getLabelCombined(parent);
        int size = 1;
        return new TreemapNode(id, parentId, size);
    }

    @Nullable
    @Contract("!null -> !null; null -> null")
    private String getLabelCombined(@Nullable Resource resource) {
        if (resource == null) {
            return null;
        }
        return getSkosPrefLabel(resource)
                .or(() -> getDCTermsTitle(resource))
                .or(() -> getSkosNotation(resource))
                .orElseGet(resource::getURI);
    }

    @NotNull
    private Optional<String> getSkosPrefLabel(@NotNull Resource resource) {
        return Optional.ofNullable(resource.getProperty(SKOS.prefLabel, Locale.getDefault().getLanguage()))
                .or(() -> Optional.ofNullable(resource.getProperty(SKOS.prefLabel)))
                .map(Statement::getString);
    }

    @NotNull
    private Optional<String> getDCTermsTitle(@NotNull Resource resource) {
        return Optional.ofNullable(resource.getProperty(DCTerms.title, Locale.getDefault().getLanguage()))
                .or(() -> Optional.ofNullable(resource.getProperty(DCTerms.title)))
                .map(Statement::getString);
    }

    @NotNull
    private Optional<String> getSkosNotation(@NotNull Resource resource) {
        return Optional.ofNullable(resource.getProperty(SKOS.notation, Locale.getDefault().getLanguage()))
                .or(() -> Optional.ofNullable(resource.getProperty(SKOS.notation)))
                .map(Statement::getString);
    }

}
