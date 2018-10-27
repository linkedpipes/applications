package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.services.geo.GeoService;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@SuppressWarnings("unused")
@RestController
public class MapController {

    @RequestMapping("/api/map/markers")
    public ResponseEntity<List<Marker>> markers(@RequestBody(required=false) Map<String, List<ValueFilter>> filters) {
        return ResponseEntity.ok(GeoService.getMarkers(filters));
    }

}
