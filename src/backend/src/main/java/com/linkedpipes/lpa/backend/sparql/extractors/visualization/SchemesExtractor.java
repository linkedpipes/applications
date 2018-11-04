package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;

import java.util.ArrayList;
import java.util.List;

public class SchemesExtractor {
    public List<Scheme> extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();

        //TODO
        return new ArrayList<>();
    }
}
