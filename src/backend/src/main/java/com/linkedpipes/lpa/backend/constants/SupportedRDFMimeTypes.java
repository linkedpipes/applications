package com.linkedpipes.lpa.backend.constants;

import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFLanguages;
import java.util.Map;

import static java.util.Map.entry;

public final class SupportedRDFMimeTypes {

    private SupportedRDFMimeTypes() {
    }

    /*
        Create array explicitly to allow for trailing comma after last array element, which improves diff readability.
     */
    private static final Map.Entry[] mimeTypeToRiotLangMappings = {
            entry("text/turtle", RDFLanguages.TTL),
            entry("application/n-triples", RDFLanguages.NT),
            entry("application/n-quads", RDFLanguages.NQ),
            entry("application/trig", RDFLanguages.TRIG),
            entry("application/rdf+xml", RDFLanguages.RDFXML),
            entry("application/ld+json", RDFLanguages.JSONLD),
    };

    @SuppressWarnings("unchecked")
    public static final Map<String, Lang> mimeTypeToRiotLangMap = Map.ofEntries(mimeTypeToRiotLangMappings);
}
