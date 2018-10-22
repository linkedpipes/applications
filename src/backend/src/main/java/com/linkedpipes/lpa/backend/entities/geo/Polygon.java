package com.linkedpipes.lpa.backend.entities.geo;

import java.util.ArrayList;
import java.util.List;

public class Polygon {
    public List<Coordinate> points;

    public Polygon(){
        points = new ArrayList<>();
    }
}
