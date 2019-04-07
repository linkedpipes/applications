package com.linkedpipes.lpa.backend.sparql.extractors.rgml;

import com.linkedpipes.lpa.backend.entities.rgml.Edge;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;

import java.util.List;
import java.util.stream.Collectors;

public class EdgesExtractor {

    public static List<Edge> extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();

        List<Resource> edges = model.listResourcesWithProperty(RDF.type, RGML.Edge).toList();

        return edges.stream().map(e ->
                new Edge(e.getURI(),
                         e.getProperty(RGML.source).getResource().getURI(),
                         e.getProperty(RGML.target).getResource().getURI(),
                         e.getProperty(RGML.weight).getDouble()))
                .collect(Collectors.toList());
    }
}
