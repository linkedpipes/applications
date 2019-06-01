package com.linkedpipes.lpa.backend.sparql.extractors.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Interval;
import com.linkedpipes.lpa.backend.entities.timeline.ThingWithInterval;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.ThingsWithIntervalQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class ThingWithIntervalExtractor {

    private final Logger log = LoggerFactory.getLogger(IntervalExtractor.class);
    private final String[] possibleLabelVariables = {ThingsWithIntervalQueryProvider.VAR_TITLE};

    public List<ThingWithInterval> extract(QueryExecution queryExec) {
        ResultSet result = queryExec.execSelect();
        List<ThingWithInterval> intervals = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd+HH:mm");

        while (result.hasNext()) {
            QuerySolution solution = result.next();
            try {
                intervals.add(new ThingWithInterval(
                                solution.getResource(ThingsWithIntervalQueryProvider.VAR_OBJECT).getURI(),
                                new Interval(solution.getResource(ThingsWithIntervalQueryProvider.VAR_INTERVAL).getURI(),
                                    dateFormat.parse(solution.getLiteral(ThingsWithIntervalQueryProvider.VAR_START).getString()),
                                    dateFormat.parse(solution.getLiteral(ThingsWithIntervalQueryProvider.VAR_END).getString())),
                                SparqlUtils.getLabel(solution, possibleLabelVariables)));
            } catch (ParseException e) {
                log.warn("Interval discarded due to date parsing error: {\n" +
                        "  startDate: " + solution.getLiteral(ThingsWithIntervalQueryProvider.VAR_START).getString() + "\n" +
                        "  endDate: " + solution.getLiteral(ThingsWithIntervalQueryProvider.VAR_END).getString() + "\n" +
                        "}");
            }
        }

        return intervals;
    }
}
