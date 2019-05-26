package com.linkedpipes.lpa.backend.sparql.extractors.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Instant;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.InstantQueryProvider;
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

public class InstantExtractor {

    private final Logger log = LoggerFactory.getLogger(InstantExtractor.class);
    private final String[] possibleLabelVariables = {InstantQueryProvider.VAR_TITLE};

    public List<Instant> extract(QueryExecution queryExec) {
        ResultSet result = queryExec.execSelect();
        List<Instant> instants = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd+HH:mm");

        while (result.hasNext()) {
            QuerySolution solution = result.next();
            try {
                instants.add(new Instant(solution.getResource(InstantQueryProvider.VAR_INSTANT).getURI(),
                        dateFormat.parse(solution.getLiteral(InstantQueryProvider.VAR_DATE).getString()),
                        SparqlUtils.getLabel(solution, possibleLabelVariables)));
            } catch (ParseException e) {
                log.warn("Instant discarded due to date parsing error: " + solution.getLiteral(InstantQueryProvider.VAR_DATE).getString());
            }
        }

        return instants;
    }
}
