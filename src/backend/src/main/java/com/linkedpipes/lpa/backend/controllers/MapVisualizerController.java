package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.MapQueryData;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.rdf.Property;
import com.linkedpipes.lpa.backend.services.geo.GeoService;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@SuppressWarnings("unused")
public class MapVisualizerController {

    private static final Logger logger = LoggerFactory.getLogger(MapVisualizerController.class);

    private final GeoService geoService;

    public MapVisualizerController(ApplicationContext context){
        geoService = context.getBean(GeoService.class);
    }


    /**
     * Get markers for displaying on map
     * @param graphIri
     * @param mapQueryData
     * @return
     */
    @PostMapping("/api/map/markers")
    public ResponseEntity<List<Marker>> getMarkers(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri,
                                                   @RequestBody(required = false) MapQueryData mapQueryData) {

        if(mapQueryData == null)
            mapQueryData = new MapQueryData();

        logger.info("Get markers: listing filters");
        for (String key : mapQueryData.filters.keySet()) {
            for (ValueFilter vf : mapQueryData.filters.get(key)) {
                logger.info("Key: " + key + ", label: " + vf.label + ", dataType: " + vf.dataType + ", uri: " + vf.uri + ", isActive: " + (vf.isActive?"yes":"no"));
            }
        }
        logger.info("Done listing filters");
        return ResponseEntity.ok(geoService.getMarkers(graphIri, mapQueryData.filters));
    }

    @GetMapping("/api/map/properties")
    public ResponseEntity<List<Property>> getProperties(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) {
        return ResponseEntity.ok(geoService.getProperties(graphIri));
    }

    //TODO create endpoints for getting polygon entities and their properties (https://github.com/ldvm/LDVMi/blob/master/src/app/controllers/api/MapApiController.scala)

}
