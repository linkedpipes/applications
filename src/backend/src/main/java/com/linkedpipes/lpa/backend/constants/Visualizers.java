package com.linkedpipes.lpa.backend.constants;

import java.util.Map;

/**
 * Translation table between discovery application IRI and frontend specific
 * identifiers.
 */
public class Visualizers {
    /**
     * The translation table between discovery application IRI and frontend
     * specific identifiers.
     */
    public static final Map<String, String> map = Map.of(
            "https://discovery.linkedpipes.com/resource/application/timeline-with-labels/template", "LABELED_TIMELINE",
            "https://discovery.linkedpipes.com/resource/application/timeline/template", "TIMELINE",
            "https://discovery.linkedpipes.com/resource/application/timeline-periods/template", "TIMELINE_PERIODS",
            "https://discovery.linkedpipes.com/resource/application/timeline-periods-with-labels/template", "LABELED_TIMELINE_PERIODS",
            "https://discovery.linkedpipes.com/resource/application/dcterms/template", "DCTERMS",
            "https://discovery.linkedpipes.com/resource/application/map/template", "MAP",
            "https://discovery.linkedpipes.com/resource/application/map-labeled-points/template", "LABELED_POINTS_MAP",
            "https://discovery.linkedpipes.com/resource/application/treemap/template", "TREEMAP",
            "https://discovery.linkedpipes.com/resource/application/chord/template", "CHORD");
}
