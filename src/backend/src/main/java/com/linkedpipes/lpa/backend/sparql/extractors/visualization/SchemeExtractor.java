package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.HierarchyNode;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;

import java.util.List;
import java.util.stream.Collectors;

public class SchemeExtractor {

    private String schemeUri;

    public SchemeExtractor(String schemeUri){
        this.schemeUri = SparqlUtils.formatUri(schemeUri);
    }

    public HierarchyNode extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();
        List<Resource> concepts = model.listSubjectsWithProperty(RDF.type, SKOS.Concept).toList();
        Resource schemeResource = model.getResource(schemeUri);
        return buildHierarchy(schemeResource, concepts, model);
    }

    private HierarchyNode buildHierarchy(Resource schemeResource, List<Resource> concepts, Model model){
        //TODO
        return null;
    }

    private HierarchyNode getNode(Model model, Resource nodeResource) {
        //get dcterms title names
        var nameNodes = model.listObjectsOfProperty(nodeResource, DCTerms.title).toList().stream().map(o -> o.asLiteral()).collect(Collectors.toList());
        //get skos prefLabel names
        nameNodes.addAll(model.listObjectsOfProperty(nodeResource, SKOS.prefLabel).toList().stream().map(o -> o.asLiteral()).collect(Collectors.toList()));

        LocalizedValue localizedName;

        if(nameNodes.size() == 0){
                localizedName = new LocalizedValue(LocalizedValue.noLanguageLabel, nodeResource.getURI());
        }
        else{
            //add all the possible names of the node to its list of localized names
            localizedName  = new LocalizedValue(nameNodes);
        }

        //set default node value to 1
        int value = 1;

        //if node has a value defined, use that value as the node size instead of the default
        if (model.contains(nodeResource, RDF.value)){
            value = model.getProperty(nodeResource, RDF.value).getInt();
        }

        return new HierarchyNode(localizedName, nodeResource.getURI(), value);
    }
}
