package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;

import java.text.SimpleDateFormat;
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

}
