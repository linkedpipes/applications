package com.linkedpipes.lpa.backend.constants;

import java.util.HashMap;
import java.util.Map;

public class Visualizers {
    public static final Map<String, String> map = new HashMap<>(){
        {
            put("https://discovery.linkedpipes.com/resource/application/timeline-with-labels/template", "LABELED_TIMELINE");
            put("https://discovery.linkedpipes.com/resource/application/timeline/template", "TIMELINE");
            put("https://discovery.linkedpipes.com/resource/application/dcterms/template", "DCTERMS");
            put("https://discovery.linkedpipes.com/resource/application/map/template", "MAP");
            put("https://discovery.linkedpipes.com/resource/application/map-labeled-points/template", "LABELED_POINTS_MAP");
        }
    };

}
