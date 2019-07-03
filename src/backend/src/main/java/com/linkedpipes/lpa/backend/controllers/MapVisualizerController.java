package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.MapQueryData;
import com.linkedpipes.lpa.backend.entities.MarkerFilterSetup;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.geo.GeoService;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MapVisualizerController {

    private static final Logger logger = LoggerFactory.getLogger(MapVisualizerController.class);

    /**
     * Get markers for displaying on map.
     *
     * @param graphIri     IRI of the result graph present in the Virtuoso
     * @param mapQueryData object containing filters to filter the markers by
     * @return a list of map markers
     * @throws LpAppsException if the retrieval fails for any reason
     */
    @PostMapping("/api/map/markers")
    public ResponseEntity<List<Marker>> getMarkers(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                   @RequestBody(required = false) MapQueryData mapQueryData) throws LpAppsException {

        if(mapQueryData == null)
            mapQueryData = new MapQueryData();

        logger.info("Get markers: listing filters");
        for (String key : mapQueryData.filters.keySet()) {
            for (ValueFilter vf : mapQueryData.filters.get(key)) {
                logger.info("Key: " + key + ", label: " + vf.label + ", dataType: " + vf.dataType + ", uri: " + vf.uri + ", isActive: " + (vf.isActive?"yes":"no"));
            }
        }
        logger.info("Done listing filters");
        return ResponseEntity.ok(GeoService.getMarkers(graphIri, mapQueryData.filters));
    }

    @GetMapping("/api/map/properties")
    public ResponseEntity<MarkerFilterSetup> getProperties(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(GeoService.getProperties(graphIri));
    }

    //TODO create endpoints for getting polygon entities and their properties (https://github.com/ldvm/LDVMi/blob/master/src/app/controllers/api/MapApiController.scala)

}
