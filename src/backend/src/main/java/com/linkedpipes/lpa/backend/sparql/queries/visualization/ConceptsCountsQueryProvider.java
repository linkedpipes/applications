package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.SKOS;
import org.jetbrains.annotations.NotNull;

import java.util.List;

//ldvmi: https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/query/ConceptCountQuery.scala
public class ConceptsCountsQueryProvider extends SelectSparqlQueryProvider {

    private final String propertyUri;
    private final String[] conceptUris;

    // VARIABLES
    public static final String VAR_CONCEPT = var("concept");
    public static final String VAR_CONCEPT_URI = var("conceptUri");
    public static final String VAR_COUNT = var("count");

    public ConceptsCountsQueryProvider(String propertyUri, List<String> conceptUris){
        this.propertyUri = SparqlUtils.formatUri(propertyUri);
        this.conceptUris = conceptUris.stream()
                .map(SparqlUtils::formatUri)
                .toArray(String[]::new);
    }

    @NotNull
    @Override
    protected SelectBuilder addPrefixes(@NotNull SelectBuilder builder) {
        return builder
                .addPrefix(Prefixes.SKOS_PREFIX, SKOS.uri);
    }

    @NotNull
    @Override
    protected SelectBuilder addVars(@NotNull SelectBuilder builder) throws ParseException {
        return builder
                .addVar(VAR_CONCEPT_URI)
                .addVar("count(" + VAR_CONCEPT + ")", VAR_COUNT);
    }

    @NotNull
    @Override
    protected SelectBuilder addWheres(@NotNull SelectBuilder builder) {
        return builder
                .addWhereValueVar(VAR_CONCEPT_URI, (Object[]) conceptUris)
                .addWhere(VAR_CONCEPT, propertyUri, VAR_CONCEPT_URI);
    }

    @NotNull
    @Override
    protected SelectBuilder addAdditional(@NotNull SelectBuilder builder) {
        return builder
                .addGroupBy(VAR_CONCEPT_URI);
    }

}
