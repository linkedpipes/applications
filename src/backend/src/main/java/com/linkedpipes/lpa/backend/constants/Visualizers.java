package com.linkedpipes.lpa.backend.constants;

import java.util.Map;

import static java.util.Map.entry;

/**
 * Translation table between discovery application IRI and frontend specific
 * identifiers.
 */
public final class Visualizers {

    /*
        Create array explicitly to allow for trailing comma after last array element, which improves diff readability.
     */
    private static final Map.Entry[] mappings = {
            entry("https://discovery.linkedpipes.com/resource/application/timeline-with-labels/template", "LABELED_TIMELINE"),
            entry("https://discovery.linkedpipes.com/resource/application/timeline/template", "TIMELINE"),
            entry("https://discovery.linkedpipes.com/resource/application/timeline-periods/template", "TIMELINE_PERIODS"),
            entry("https://discovery.linkedpipes.com/resource/application/timeline-periods-with-labels/template", "LABELED_TIMELINE_PERIODS"),
            entry("https://discovery.linkedpipes.com/resource/application/dcterms/template", "DCTERMS"),
            entry("https://discovery.linkedpipes.com/resource/application/map/template", "MAP"),
            entry("https://discovery.linkedpipes.com/resource/application/map-labeled-points/template", "LABELED_POINTS_MAP"),
            entry("https://discovery.linkedpipes.com/resource/application/map-advanced-filters/template", "MAP_WITH_MARKER_FILTERS"),
            entry("https://discovery.linkedpipes.com/resource/application/treemap/template", "TREEMAP"),
            entry("https://discovery.linkedpipes.com/resource/application/chord/template", "CHORD"),
    };

    /**
     * The translation table between discovery application IRI and frontend
     * specific identifiers.
     */
    @SuppressWarnings("unchecked")
    public static final Map<String, String> map = Map.ofEntries(mappings);

    private Visualizers() {
    }

}
