package com.linkedpipes.lpa.backend.entities.geo;

import java.util.ArrayList;
import java.util.List;

public class Polygon {
    public List<Coordinates> points;

    public Polygon(){
        points = new ArrayList<>();
    }
}
