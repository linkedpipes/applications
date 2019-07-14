package com.linkedpipes.lpa.backend.sparql.extractors.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Instant;
import com.linkedpipes.lpa.backend.entities.timeline.ThingWithInstant;
import com.linkedpipes.lpa.backend.entities.timeline.ThingWithThingWithInstant;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.ThingsWithThingsWithInstantQueryProvider;
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

public class ThingWithThingWithInstantExtractor {

    private final Logger log = LoggerFactory.getLogger(InstantExtractor.class);
    private final String[] possibleLabelVariables = {ThingsWithThingsWithInstantQueryProvider.VAR_TITLE};

    public List<ThingWithThingWithInstant> extract(QueryExecution queryExec) {
        ResultSet result = queryExec.execSelect();
        List<ThingWithThingWithInstant> instants = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd+HH:mm");

        while (result.hasNext()) {
            QuerySolution solution = result.next();
            try {
                instants.add(new ThingWithThingWithInstant(
                                solution.getResource(ThingsWithThingsWithInstantQueryProvider.VAR_DISTANT_OBJECT).getURI(),
                                new ThingWithInstant(solution.getResource(ThingsWithThingsWithInstantQueryProvider.VAR_OBJECT).getURI(),
                                new Instant(solution.getResource(ThingsWithThingsWithInstantQueryProvider.VAR_INSTANT).getURI(),
                                        dateFormat.parse(solution.getLiteral(ThingsWithThingsWithInstantQueryProvider.VAR_DATE).getString()),
                                        SparqlUtils.getLabel(solution, possibleLabelVariables)))));
            } catch (ParseException e) {
                log.warn("Instant discarded due to date parsing error: " + solution.getLiteral(ThingsWithThingsWithInstantQueryProvider.VAR_DATE).getString());
            }
        }

        return instants;
    }
}
