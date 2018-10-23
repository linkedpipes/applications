package com.linkedpipes.lpa.backend.services.geo;

import com.linkedpipes.lpa.backend.entities.geo.*;

import java.util.ArrayList;
import java.util.List;

//synonymous to https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/geo/GeoServiceImpl.scala
//TODO implement
public class GeoService {

    public List<Marker> getMarkers(){
        //TODO run sparql query to get markers here using SparqlService class
        return new ArrayList<>();
    }

    public List<Polygon> getPolygons(){
        return new ArrayList<>();
    }
}
