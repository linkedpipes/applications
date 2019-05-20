package com.linkedpipes.lpa.backend.sparql.extractors.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Interval;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.IntervalQueryProvider;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class IntervalExtractor {

    public static List<Interval> extract(QueryExecution queryExec) {
        ResultSet result = queryExec.execSelect();
        List<Interval> intervals = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        while (result.hasNext()) {
            QuerySolution solution = result.next();
            try {
                intervals.add(new Interval(solution.getLiteral(IntervalQueryProvider.VAR_INTERVAL).getString(),
                        dateFormat.parse(solution.getLiteral(IntervalQueryProvider.VAR_START).getString()),
                        dateFormat.parse(solution.getLiteral(IntervalQueryProvider.VAR_END).getString())));
            }
            catch(ParseException e){
                System.out.println("Interval discarded due to date parsing error");
            }
        }

        return intervals;
    }
}
