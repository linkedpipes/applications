package com.linkedpipes.lpa.backend.util;

public class SparqlUtils {
    public static String formatUri(String uri) {
        return "<" + uri + ">";
    }
    public static String formatLabel(String label) {
        return "'" + label + "'";
    }
}
