package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.geo.Coordinate;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.services.MapServiceComponent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MapController {
    private final MapServiceComponent mapService;

    public MapController(){
        mapService = new MapServiceComponent();
    }

    @RequestMapping("/api/map/markers")
    public ResponseEntity<?> markers() {
        //TODO call geoService to get actual markers
        List<Marker> dummyMarkers = new ArrayList<>();
        dummyMarkers.add(new Marker("testUri1", new Coordinate(7.84624, -59.40816), "", ""));
        dummyMarkers.add(new Marker("testUri2", new Coordinate(65.33371, 111.46105), "", ""));
        dummyMarkers.add(new Marker("testUri3", new Coordinate(31.23245, -80.42539), "", ""));

        return ResponseEntity.ok(dummyMarkers);
    }
}
