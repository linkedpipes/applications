package com.linkedpipes.lpa.backend.sparql.extractors.rgml;

import com.linkedpipes.lpa.backend.entities.rgml.Graph;
import com.linkedpipes.lpa.backend.sparql.queries.rgml.GraphQueryProvider;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;

public class GraphExtractor {

    public static Graph extract(QueryExecution queryExec){
        ResultSet result = queryExec.execSelect();

        if(!result.hasNext())
            return null;

        QuerySolution solution = result.next();

        return new Graph(solution.getLiteral(GraphQueryProvider.VAR_DIRECTED).getBoolean(),
                         solution.getLiteral(GraphQueryProvider.VAR_NODE_COUNT).getInt(),
                         solution.getLiteral(GraphQueryProvider.VAR_EDGE_COUNT).getInt());
    }
}
