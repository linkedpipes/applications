package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPD;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPDSparql;
import com.linkedpipes.lpa.backend.rdf.vocabulary.SD;
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceConfigurationQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceExtractorQueryProvider;
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RIOT;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.DataInputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class TtlGenerator {

    private static final String DATASET_URI = "https://lpapps.com/dataset/";
    private static final String DATASET_TEMPLATE_TITLE = "Unspecified user-provided dataset template";
    private static final String DATASET_OUTPUT_TITLE = "Unspecified user-provided dataset output";
    private static final String DATASET_CONFIG_TITLE = "Unspecified user-provided dataset default configuration";

    private static final SparqlQueryProvider<?> EXTRACTOR_QUERY_PROVIDER = new DefaultDataSourceExtractorQueryProvider();
    private static final SparqlQueryProvider<?> CONFIGURATION_QUERY_PROVIDER = new DefaultDataSourceConfigurationQueryProvider();

    @NotNull
    public static String getDiscoveryConfig(@NotNull List<DataSource> dataSourceList) {
        RIOT.init();

        // create an empty model
        Model model = ModelFactory.createDefaultModel();

        //read base rdf from resource
        InputStream fileStream = new DataInputStream(TtlGenerator.class.getResourceAsStream("base.ttl"));
        model.read(fileStream, "", "TURTLE");

        //add data sources
        Resource subject = model.createResource("https://discovery.linkedpipes.com/resource/discovery/all-and-generated/config");
        Property property = model.createProperty("https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate");

        dataSourceList.stream()
                .map(dataSource -> dataSource.uri)
                .map(model::createResource)
                .forEach(resource -> model.add(subject, property, resource));

        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        return stringWriter.toString();
    }

    @NotNull
    public static String getTemplateDescription(@NotNull String sparqlEndpointUrl,
                                                @NotNull String dataSampleUrl,
                                                @Nullable String graphName) {
        Objects.requireNonNull(sparqlEndpointUrl);
        Objects.requireNonNull(dataSampleUrl);

        Optional<String> graphNameOptional = Optional.ofNullable(graphName);

        String extractorQuery = graphNameOptional
                .map(EXTRACTOR_QUERY_PROVIDER::getForNamed)
                .orElseGet(EXTRACTOR_QUERY_PROVIDER)
                .toString();
        String configurationQuery = graphNameOptional
                .map(CONFIGURATION_QUERY_PROVIDER::getForNamed)
                .orElseGet(CONFIGURATION_QUERY_PROVIDER)
                .toString();

        RIOT.init();

        Model model = ModelFactory.createDefaultModel();

        Resource output = model.createResource(DATASET_URI + "output");
        model.add(output, RDF.type, LPD.OutputDataPortTemplate);
        model.add(output, DCTerms.title, DATASET_OUTPUT_TITLE);
        model.add(output, LPD.outputDataSample, model.createResource(dataSampleUrl));

        Resource defaultService = model.createResource(DATASET_URI + "defaultService");
        model.add(defaultService, RDF.type, SD.Service);
        model.add(defaultService, SD.endpoint, model.createResource(sparqlEndpointUrl));

        Resource defaultConfiguration = model.createResource(DATASET_URI + "defaultConfiguration");
        model.add(defaultConfiguration, RDF.type, LPDSparql.SparqlEndpointDataSourceConfiguration);
        model.add(defaultConfiguration, DCTerms.title, DATASET_CONFIG_TITLE);
        model.add(defaultConfiguration, LPD.service, defaultService);
        model.add(defaultConfiguration, LPD.query, extractorQuery);
        model.add(defaultConfiguration, LPD.configurationQuery, configurationQuery);

        Resource template = model.createResource(DATASET_URI + "template");
        model.add(template, RDF.type, LPD.DataSourceTemplate);
        model.add(template, DCTerms.title, DATASET_TEMPLATE_TITLE, "en");
        model.add(template, LPD.outputTemplate, output);
        model.add(template, LPD.componentConfigurationTemplate, defaultConfiguration);

        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        return stringWriter.toString();
    }

}
