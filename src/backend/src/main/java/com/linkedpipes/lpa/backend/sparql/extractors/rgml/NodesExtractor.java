package com.linkedpipes.lpa.backend.sparql.extractors.rgml;

import com.linkedpipes.lpa.backend.entities.rgml.Node;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.rdf.vocabulary.RGML;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

import java.util.List;
import java.util.stream.Collectors;

public class NodesExtractor {

    public static List<Node> extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();

        List<Resource> nodes = model.listResourcesWithProperty(RDF.type, RGML.Node).toList();

        return nodes.stream().map(n ->
                new Node(n.getURI(), new LocalizedValue(n, RDFS.label)))
                .collect(Collectors.toList());
    }
}
