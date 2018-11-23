package com.linkedpipes.lpa.backend.controllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.linkedpipes.lpa.backend.entities.geo.Marker;
import com.linkedpipes.lpa.backend.services.geo.GeoService;
import com.linkedpipes.lpa.backend.sparql.ValueFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@SuppressWarnings("unused")
public class MapController {

    @PostMapping("/api/map/markers")
    public ResponseEntity<List<Marker>> getMarkers(@RequestBody(required = false) Map<String, List<ValueFilter>> filters) {
        return ResponseEntity.ok(GeoService.getMarkers(filters));
    }

    @GetMapping("/api/map/properties")
    public ResponseEntity<List<Map<String, ?>>> getProperties() {
        // return ResponseEntity.ok(GeoService.getProperties());
        String response =
                "[\n" +
                "  {\n" +
                "    \"label\": {\n" +
                "      \"variants\": {\n" +
                "        \"cs\": \"Činnosti podle přílohy č. 1 zákona o integrované prevenci\"\n" +
                "      }\n" +
                "    },\n" +
                "    \"uri\": \"http://linked.opendata.cz/ontology/domain/mzp.cz/hlavniKategorie\",\n" +
                "    \"schemeUri\": \"http://linked.opendata.cz/ontology/domain/mzp.cz/categories/ConceptScheme\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"label\": {\n" +
                "      \"variants\": {\n" +
                "        \"cs\": \"Činnosti podle přílohy č. 1 zákona o integrované prevenci\"\n" +
                "      }\n" +
                "    },\n" +
                "    \"uri\": \"http://linked.opendata.cz/ontology/domain/mzp.cz/vedlejsiKategorie\",\n" +
                "    \"schemeUri\": \"http://linked.opendata.cz/ontology/domain/mzp.cz/categories/ConceptScheme\"\n" +
                "  }\n" +
                "]\n";
        return ResponseEntity.ok(new Gson().fromJson(response, new TypeToken<List<Map<String, ?>>>(){}.getType()));
    }

}
