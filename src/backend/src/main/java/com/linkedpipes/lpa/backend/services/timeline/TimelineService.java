package com.linkedpipes.lpa.backend.services.timeline;

import com.linkedpipes.lpa.backend.entities.timeline.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.sparql.extractors.timeline.*;
import com.linkedpipes.lpa.backend.sparql.queries.SelectSparqlQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.timeline.*;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class TimelineService {

    public List<Instant> getInstants(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new InstantQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new InstantExtractor()::extract);
    }

    public List<ThingWithInstant> getThingsWithInstant(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new ThingsWithInstantQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ThingWithInstantExtractor()::extract);
    }

    public List<ThingWithThingWithInstant> getThingsWithThingsWithInstant(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new ThingsWithThingsWithInstantQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ThingWithThingWithInstantExtractor()::extract);
    }

    public List<Interval> getIntervals(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new IntervalQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new IntervalExtractor()::extract);
    }

    public List<ThingWithInterval> getThingsWithIntervals(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new ThingsWithIntervalQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ThingWithIntervalExtractor()::extract);
    }

    public List<ThingWithThingWithInterval> getThingsWithThingsWithIntervals(@Nullable String graphIri, @Nullable Date start, @Nullable Date end) throws LpAppsException {
        SelectSparqlQueryProvider provider = new ThingsWithThingsWithIntervalQueryProvider(start, end);
        return JenaUtils.withQueryExecution(provider.get(graphIri), new ThingWithThingWithIntervalExtractor()::extract);
    }
}
