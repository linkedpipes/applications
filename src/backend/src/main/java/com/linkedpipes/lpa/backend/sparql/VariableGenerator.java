package com.linkedpipes.lpa.backend.sparql;

public class VariableGenerator {

    private int i = 0;

    public String getVariable(){
        i++;
        return "?" + getName();
    }

    private String getName(){
        return "v" + Integer.toString(i);
    }

    public void reset() {
        i = 0;
    }
}
