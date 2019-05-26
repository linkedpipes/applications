package com.linkedpipes.lpa.backend.services.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.Instant;
import com.linkedpipes.lpa.backend.entities.timeline.Interval;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.sparql.extractors.timeline.InstantExtractor;
import com.linkedpipes.lpa.backend.sparql.extractors.timeline.IntervalExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.InstantQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.IntervalQueryProvider;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TimelineService {

    public List<Interval> getIntervals(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new IntervalQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new IntervalExtractor()::extract);
    }

    public List<Instant> getInstants(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new InstantQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new InstantExtractor()::extract);
    }
}
