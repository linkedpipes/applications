package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Concept;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;

import java.util.ArrayList;
import java.util.List;

public class ConceptsExtractor {
    public List<Concept> extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();

        //TODO
        return new ArrayList<>();
    }
}
