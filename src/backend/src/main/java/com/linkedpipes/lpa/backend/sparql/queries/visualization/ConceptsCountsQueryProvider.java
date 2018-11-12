package com.linkedpipes.lpa.backend.sparql.queries.visualization;

import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.arq.querybuilder.SelectBuilder;
import org.apache.jena.sparql.lang.sparql_11.ParseException;
import org.apache.jena.vocabulary.SKOS;

//ldvmi: https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/query/ConceptCountQuery.scala
public class ConceptsCountsQueryProvider extends SelectSparqlQueryProvider {

    private String propertyUri;
    private String conceptUri;

    // PREFIXES
    private static final String SKOS_PREFIX = "skos";

    // VARIABLES
    public static final String VAR_X = var("x");

    public ConceptsCountsQueryProvider(String propertyUri, String conceptUri){
        this.propertyUri = propertyUri;
        this.conceptUri = conceptUri;
    }

    @Override
    protected SelectBuilder addPrefixes(SelectBuilder builder) {
        return builder
                .addPrefix(SKOS_PREFIX, SKOS.uri);
    }

    @Override
    protected SelectBuilder addVars(SelectBuilder builder) throws ParseException {
        return builder
                .addVar("count(" + VAR_X + ")", "?count");
    }

    @Override
    protected SelectBuilder addWheres(SelectBuilder builder) {
        return builder
                .addWhere(VAR_X, SparqlUtils.formatUri(propertyUri), SparqlUtils.formatUri(conceptUri));
    }

}
