package com.linkedpipes.lpa.backend.services.hierarchy;

import com.linkedpipes.lpa.backend.entities.hierarchy.TreemapNode;
import com.linkedpipes.lpa.backend.sparql.extractors.hierarchy.TreemapHierarchyExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.ConstructSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.hierarchy.TreemapHierarchyQueryProvider;
import org.apache.jena.query.QueryExecutionFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HierarchyServiceComponent implements HierarchyService {

    // private static final String ENDPOINT = Application.getConfig().getString("lpa.virtuoso.queryEndpoint");
    private static final String ENDPOINT = "https://linked.opendata.cz/sparql"; // TODO: 25.2.19 remove this hard-coded value after demo

    @Override
    public List<TreemapNode> getTreemapHierarchy() {
        ConstructSparqlQueryProvider provider = new TreemapHierarchyQueryProvider();
        return new TreemapHierarchyExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.get()));
    }

    public List<TreemapNode> getTreemapHierarchyFromNamed(String resultGraphIri) {
        ConstructSparqlQueryProvider provider = new TreemapHierarchyQueryProvider();
        return new TreemapHierarchyExtractor().extract(QueryExecutionFactory.sparqlService(ENDPOINT, provider.getForNamed(resultGraphIri)));
    }

}
