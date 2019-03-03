package com.linkedpipes.lpa.backend.constants;

import java.util.HashMap;
import java.util.Map;

public class Visualizers {
    public static final Map<String, String> map = new HashMap<>();

    static {
        map.put("https://discovery.linkedpipes.com/resource/application/timeline-with-labels/template", "LABELED_TIMELINE");
        map.put("https://discovery.linkedpipes.com/resource/application/timeline/template", "TIMELINE");
        map.put("https://discovery.linkedpipes.com/resource/application/timeline-periods/template", "TIMELINE_PERIODS");
        map.put("https://discovery.linkedpipes.com/resource/application/timeline-periods-with-labels/template", "LABELED_TIMELINE_PERIODS");
        map.put("https://discovery.linkedpipes.com/resource/application/dcterms/template", "DCTERMS");
        map.put("https://discovery.linkedpipes.com/resource/application/map/template", "MAP");
        map.put("https://discovery.linkedpipes.com/resource/application/map-labeled-points/template", "LABELED_POINTS_MAP");
    }
}

