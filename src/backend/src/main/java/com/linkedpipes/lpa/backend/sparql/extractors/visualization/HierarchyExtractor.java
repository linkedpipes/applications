package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.HierarchyNode;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

//This extractor is currently unused, possibly useful for future hierarchy visualizers
/*
public class HierarchyExtractor {

    private String schemeUri;
    private HashMap<String, HierarchyNode> conceptsByUri;
    private HashMap<String, List<String>> hierarchyLinksByUri;

    public HierarchyExtractor(String schemeUri) {
        this.schemeUri = SparqlUtils.formatUri(schemeUri);
        this.conceptsByUri = new HashMap();
        this.hierarchyLinksByUri = new HashMap();
    }

    public HierarchyNode extract(QueryExecution queryExec) {
        Model model = queryExec.execConstruct();
        List<Resource> concepts = model.listSubjectsWithProperty(RDF.type, SKOS.Concept).toList();
        Resource schemeResource = model.getResource(schemeUri);
        return (schemeResource == null) ? null : buildHierarchy(schemeResource, concepts, model);
    }

    //TODO also consider adding parent node for each created hierarchyNode
    private HierarchyNode buildHierarchy(Resource schemeResource, List<Resource> concepts, Model model) {
        */
/* iterate over all the concepts and add them to the conceptsByUri hashmap. If a concept has a value for broader,
        we add this broader in a seperate hierarchyLinksByUri hashmap we use for holding links to children - ie. the
        original concept is added as a child of the broader uri because the broader the term, the higher it is in the
        hierarchy tree. *//*


        //The rootUris are only those that have no broader link.
        var rootUris = concepts.stream().map(n -> {
            var nodeResource = n.asResource();
            conceptsByUri.put(nodeResource.getURI(), getNode(model, nodeResource));

            var broaderNodeResource = nodeResource.getPropertyResourceValue(SKOS.broader);

            //TODO check if we should cater for multiple broader resources.. if so we need to use flatmap instead of map
            if (broaderNodeResource != null) {
                List<String> updatedHierarchyLinksForUri = hierarchyLinksByUri.getOrDefault(broaderNodeResource.getURI(), new ArrayList());
                updatedHierarchyLinksForUri.add(nodeResource.getURI());
                hierarchyLinksByUri.put(broaderNodeResource.getURI(), updatedHierarchyLinksForUri);

                //since concept has a broader node, it is not a root uri thus return null
                return null;
            }

            //concept has no broader node, thus return it's uri to add to the list of roots
            return nodeResource.getURI();
        });

        var roots = rootUris.map(this::buildSubtree).collect(Collectors.toList());

        var possibleLabels = new ArrayList<>(
                List.of(SKOS.prefLabel, DCTerms.title, RDFS.label));

        var literals = possibleLabels.stream().flatMap(labelProperty -> {
            var properties = schemeResource.listProperties(labelProperty).toList();
            return properties.stream().map(p -> p.getLiteral());
        });

        //TODO in ldvmi, the reverse function is used for below.. check if it's necessary
        var literalsMap = literals.collect(Collectors.toMap(i -> i.getLanguage(), i -> i.getString()));

        LocalizedValue schemeLabel;
        if (literalsMap.isEmpty()) {
            String[] splitSchemeUri = schemeUri.split("[/#]");

            String name = splitSchemeUri.length == 0 ? schemeUri : splitSchemeUri[splitSchemeUri.length - 1];
            schemeLabel = new LocalizedValue(LocalizedValue.noLanguageLabel, name);
        } else {
            schemeLabel = new LocalizedValue(literalsMap);
        }

        return new HierarchyNode(schemeLabel, schemeUri, 1, roots);
    }

    private HierarchyNode getNode(Model model, Resource nodeResource) {
        //get dcterms title names
        var nameNodes = model.listObjectsOfProperty(nodeResource, DCTerms.title).toList().stream().map(o -> o.asLiteral()).collect(Collectors.toList());
        //get skos prefLabel names
        nameNodes.addAll(model.listObjectsOfProperty(nodeResource, SKOS.prefLabel).toList().stream().map(o -> o.asLiteral()).collect(Collectors.toList()));

        LocalizedValue localizedName;

        if (nameNodes.size() == 0) {
            localizedName = new LocalizedValue(LocalizedValue.noLanguageLabel, nodeResource.getURI());
        } else {
            //add all the possible names of the node to its list of localized names
            localizedName = new LocalizedValue(nameNodes);
        }

        //set default node value to 1
        int value = 1;

        //if node has a value defined, use that value as the node size instead of the default
        if (model.contains(nodeResource, RDF.value)) {
            value = model.getProperty(nodeResource, RDF.value).getInt();
        }

        return new HierarchyNode(localizedName, nodeResource.getURI(), value);
    }

    private HierarchyNode buildSubtree(String rootUri) {

        HierarchyNode maybeConceptNode = conceptsByUri.get(rootUri);

        List<String> maybeChildrenList = hierarchyLinksByUri.get(rootUri);

        //TODO check if we are missing some important logic below from LDVMi
        var maybeChildren = maybeChildrenList.stream().map(this::buildSubtree).collect(Collectors.toList());

        Integer size = (maybeChildren == null || maybeChildren.isEmpty()) ? 1 : null;

        return new HierarchyNode(maybeConceptNode.label, maybeConceptNode.id, size, maybeChildren);
    }
}
*/
