package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.timeline.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.timeline.TimelineService;
import org.jetbrains.annotations.Nullable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TimelineController {

    private final TimelineService timelineService;

    public TimelineController(ApplicationContext context){
        timelineService = context.getBean(TimelineService.class);
    }

    @GetMapping("/api/timeline/instants")
    public ResponseEntity<List<Instant>> getInstants(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getInstants(graphIri, null, null));
    }

    @GetMapping("/api/timeline/thingswithinstants")
    public ResponseEntity<List<ThingWithInstant>> getThingsWithInstants(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getThingsWithInstant(graphIri, null, null));
    }

    @GetMapping("/api/timeline/thingswiththingswithinstants")
    public ResponseEntity<List<ThingWithThingWithInstant>> getThingsWithThingsWithInstants(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getThingsWithThingsWithInstant(graphIri, null, null));
    }

    @GetMapping("/api/timeline/intervals")
    public ResponseEntity<List<Interval>> getIntervals(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getIntervals(graphIri, null, null));
    }

    @GetMapping("/api/timeline/thingswithintervals")
    public ResponseEntity<List<ThingWithInterval>> getThingsWithIntervals(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getThingsWithIntervals(graphIri, null, null));
    }

    @GetMapping("/api/timeline/thingswiththingswithintervals")
    public ResponseEntity<List<ThingWithThingWithInterval>> getThingsWithThingsWithIntervals(@Nullable @RequestParam(value = "resultGraphIri", required = false) String graphIri) throws LpAppsException {
        return ResponseEntity.ok(timelineService.getThingsWithThingsWithIntervals(graphIri, null, null));
    }

}
