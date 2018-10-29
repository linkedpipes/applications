package com.linkedpipes.lpa.backend.sparql.queries;

import org.apache.jena.query.Query;

import java.util.function.Supplier;

import static java.util.Objects.requireNonNull;

public interface SparqlQueryProvider extends Supplier<Query> {

    Query get();

    static String var(String variableName) {
        if (requireNonNull(variableName).isEmpty()) {
            throw new IllegalArgumentException("variableName");
        }
        return variableName.startsWith("?") ? variableName : "?" + variableName;
    }

    static String pred(String prefix, String name) {
        requireNonNull(prefix);
        requireNonNull(name);
        if (prefix.endsWith(":")) {
            prefix = prefix.substring(0, prefix.length() - 1);
        }
        if (name.startsWith(":")) {
            name = name.substring(1);
        }
        if (prefix.isEmpty()) {
            throw new IllegalArgumentException("prefix");
        }
        if (name.isEmpty()) {
            throw new IllegalArgumentException("name");
        }

        return prefix + ":" + name;
    }

}
