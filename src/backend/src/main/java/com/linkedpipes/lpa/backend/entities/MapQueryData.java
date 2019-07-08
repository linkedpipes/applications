package com.linkedpipes.lpa.backend.entities;

import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapQueryData {

    @NotNull
    public Map<String, List<ValueFilter>> filters = new HashMap<>();

}
