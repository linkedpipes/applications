package com.linkedpipes.lpa.backend.entities;

import com.linkedpipes.lpa.backend.sparql.ValueFilter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapQueryData {
    public Map<String, List<ValueFilter>> filters;

    public MapQueryData() {
        filters = new HashMap<>();
    }
}
