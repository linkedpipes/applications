package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.ExtractGraphQueryProvider;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.query.*;
import org.apache.jena.riot.RDFLanguages;
import org.apache.jena.riot.RDFDataMgr;


import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.Date;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toList;

public class SparqlUtils {
    public static String formatUri(String uri) {
        if (!uri.startsWith("<")) {
            uri = "<" + uri;
        }
        return uri.endsWith(">") ? uri : uri + ">";
    }

    public static String formatLabel(String label) {
        return "'" + label + "'";
    }

    public static String formatXSDDate(Date date){
        return "xsd:date(\"" + (new SimpleDateFormat("yyyy-MM-dd" ).format(date)) + "\")";
    }

    public static LocalizedValue getCombinedLabel(Resource resource, Property... labelProperties) {
        return Arrays.stream(labelProperties)
                .map(resource::listProperties)
                .flatMap(Streams::sequentialFromIterator)
                .map(Statement::getLiteral)
                .collect(collectingAndThen(toList(), LocalizedValue::new));
    }

    public static String extractTTL(String namedGraph) {
        ConstructSparqlQueryProvider provider = new ExtractGraphQueryProvider();
        Query query = provider.get(namedGraph);

        try (QueryExecution queryExecution = QueryExecutionFactory.sparqlService(Application.getConfig().getString(ApplicationPropertyKeys.VIRTUOSO_QUERY_ENDPOINT), query)) {
            Model model = queryExecution.execConstruct();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            RDFDataMgr.write(baos, model, RDFLanguages.TTL);
            return baos.toString(java.nio.charset.StandardCharsets.UTF_8);
        }
    }

}
