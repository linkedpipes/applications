package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPA;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPD;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPDSparql;
import com.linkedpipes.lpa.backend.rdf.vocabulary.SD;
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceConfigurationQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceExtractorQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import com.linkedpipes.lpa.backend.util.rdfbuilder.ModelBuilder;
import com.linkedpipes.lpa.backend.util.rdfbuilder.ResourceBuilder;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class TtlGenerator {

    private static final String DATASET_OUTPUT_TITLE = "Unspecified user-provided dataset output";
    private static final String DATASET_CONFIG_TITLE = "Unspecified user-provided dataset default configuration";

    private static final SparqlQueryProvider EXTRACTOR_QUERY_PROVIDER = new DefaultDataSourceExtractorQueryProvider();
    private static final SparqlQueryProvider CONFIGURATION_QUERY_PROVIDER = new DefaultDataSourceConfigurationQueryProvider();

    private static final Logger log = LoggerFactory.getLogger(TtlGenerator.class);

    @NotNull
    public static String getDiscoveryConfig(@NotNull List<DataSource> dataSourceList) {
        ModelBuilder builder = ModelBuilder.from(TtlGenerator.class.getResource("base.ttl"));
        ResourceBuilder config = builder.resource("https://discovery.linkedpipes.com/resource/discovery/all-and-generated/config");
        for (DataSource dataSource : dataSourceList) {
            config.property("https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate", resource(dataSource.uri));
        }
        return builder.toString();
    }

    @NotNull
    public static String getTemplateDescription(@NotNull String sparqlEndpointIri,
                                                @NotNull String dataSampleIri,
                                                @Nullable List<String> namedGraphs) {
        String extractorQuery = EXTRACTOR_QUERY_PROVIDER.get().toString();
        String configurationQuery = CONFIGURATION_QUERY_PROVIDER.get().toString();

        ModelBuilder builder = ModelBuilder.empty()
                .namespace("dataset", LPA.Dataset.uri)
                .namespace("lpd", LPD.uri)
                .namespace(Prefixes.DCTERMS_PREFIX, DCTerms.getURI())
                .namespace("lpd-sparql", LPDSparql.uri)
                .namespace(Prefixes.SD_PREFIX, SD.uri);

        ResourceBuilder template = builder.resource(LPA.Dataset.template);
        template.property(RDF.type, LPD.DataSourceTemplate)
                .property(DCTerms.title, DiscoveryServiceComponent.OUR_DATASET_TEMPLATE_TITLE, "en");

        ResourceBuilder output = template.resource(LPD.outputTemplate, LPA.Dataset.output);
        output.property(RDF.type, LPD.OutputDataPortTemplate)
                .property(DCTerms.title, DATASET_OUTPUT_TITLE)
                .property(LPD.outputDataSample, resource(dataSampleIri));

        ResourceBuilder defaultConfiguration = template.resource(LPD.componentConfigurationTemplate, LPA.Dataset.defaultConfiguration);
        defaultConfiguration.property(RDF.type, LPDSparql.SparqlEndpointDataSourceConfiguration)
                .property(DCTerms.title, DATASET_CONFIG_TITLE)
                .property(LPD.query, extractorQuery)
                .property(LPD.configurationQuery, configurationQuery);

        ResourceBuilder defaultService = defaultConfiguration.resource(LPD.service, LPA.Dataset.defaultService);
        defaultService.property(RDF.type, SD.Service)
                .property(SD.endpoint, resource(sparqlEndpointIri));

        if (namedGraphs != null && !namedGraphs.isEmpty()) {
            namedGraphs.forEach(graphName -> defaultService
                    .resource(SD.namedGraph)
                    .property(SD.name, resource(graphName)));
        }

        return builder.toString();
    }

    @NotNull
    public static String getVirtuosoServiceDescription(@NotNull String graphName) {
        ModelBuilder builder = ModelBuilder.from(DiscoveryServiceComponent.class.getResource("virtuoso_sd.ttl"));
        String virtuosoEndpoint = Application.getConfig().getString("lpa.virtuoso.crudEndpoint");

        builder.resource(virtuosoEndpoint + "/service")
                .resource(SD.namedGraph)
                .property(SD.name, resource(graphName));

        String serviceDescription = builder.toString();
        log.debug(String.format("Service description of our Virtuoso server for named graph <%s> is:\n%s", graphName, serviceDescription));
        return serviceDescription;
    }

    @NotNull
    public static Resource resource(String uri) {
        return ResourceFactory.createResource(uri);
    }

}
