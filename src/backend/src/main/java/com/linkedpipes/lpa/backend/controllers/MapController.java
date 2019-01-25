package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.rdf.Property;
import com.linkedpipes.lpa.backend.services.geo.GeoService;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@SuppressWarnings("unused")
public class MapController {

    @PostMapping("/api/map/markers")
    public ResponseEntity<List<Marker>> getMarkers(@RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                   @RequestBody(required = false) Map<String, List<ValueFilter>> filters) {
        return Optional.ofNullable(graphIri)
                .map(iri -> GeoService.getMarkersFromNamed(iri, filters))
                .or(() -> Optional.of(GeoService.getMarkers(filters)))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @GetMapping("/api/map/properties")
    public ResponseEntity<List<Property>> getProperties(@RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return Optional.ofNullable(graphIri)
                .map(GeoService::getPropertiesFromNamed)
                .or(() -> Optional.of(GeoService.getProperties()))
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

}
