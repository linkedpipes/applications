package com.linkedpipes.lpa.backend.sparql.extractors.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Instant;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.InstantQueryProvider;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class InstantExtractor {

    public static List<Instant> extract(QueryExecution queryExec) {
        ResultSet result = queryExec.execSelect();
        List<Instant> instants = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        while (result.hasNext()) {
            QuerySolution solution = result.next();
            try {
                instants.add(new Instant(solution.getLiteral(InstantQueryProvider.VAR_INSTANT).getString(),
                        dateFormat.parse(solution.getLiteral(InstantQueryProvider.VAR_DATE).getString())));
            }
            catch(ParseException e){
                System.out.println("Instant discarded due to date parsing error");
            }
        }

        return instants;
    }
}
