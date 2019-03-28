package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.rdf.Prefixes;
import com.linkedpipes.lpa.backend.rdf.vocabulary.*;
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
import java.util.*;

public class TtlGenerator {

    private static final String DATASET_TEMPLATE_TITLE = "Unspecified user-provided dataset template";
    private static final String DATASET_OUTPUT_TITLE = "Unspecified user-provided dataset output";
    private static final String DATASET_CONFIG_TITLE = "Unspecified user-provided dataset default configuration";

    private static final SparqlQueryProvider<?> EXTRACTOR_QUERY_PROVIDER = new DefaultDataSourceExtractorQueryProvider();
    private static final SparqlQueryProvider<?> CONFIGURATION_QUERY_PROVIDER = new DefaultDataSourceConfigurationQueryProvider();

    @NotNull
    public static String getDiscoveryConfig(@NotNull List<DataSource> dataSourceList) {
        return writeModelToString(getDiscoveryConfigModel(dataSourceList));
    }

    @NotNull
    public static String getTemplateDescription(@NotNull String sparqlEndpointIri,
                                                @NotNull String dataSampleIri,
                                                @Nullable String namedGraph) {
        String extractorQuery = EXTRACTOR_QUERY_PROVIDER.get().toString();
        String configurationQuery = CONFIGURATION_QUERY_PROVIDER.get().toString();

        return writeModelToString(
                getTemplateDescriptionModel(sparqlEndpointIri, dataSampleIri,
                        extractorQuery, configurationQuery, namedGraph));
    }

    public static <E> String createRgmlGraph(Map<E, Map<E, Integer>> weightedGraph) {
        return writeModelToString(createRgmlGraphModel(weightedGraph));
    }

    @NotNull
    private static Model getDiscoveryConfigModel(@NotNull List<DataSource> dataSourceList) {
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
        return model;
    }

    @NotNull
    private static Model getTemplateDescriptionModel(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri,
                                                     @NotNull String extractorQuery, @NotNull String configurationQuery,
                                                     @Nullable String namedGraph) {
        RIOT.init();

        Model model = ModelFactory.createDefaultModel()
                .setNsPrefixes(Map.of(
                        "dataset", LPA.Dataset.uri,
                        "lpd", LPD.uri,
                        "dcterms", DCTerms.getURI(),
                        "lpd-sparql", LPDSparql.uri,
                        "sd", SD.uri
                ));

        Resource output = model.createResource(LPA.Dataset.uri + "output");
        model.add(output, RDF.type, LPD.OutputDataPortTemplate);
        model.add(output, DCTerms.title, DATASET_OUTPUT_TITLE);
        model.add(output, LPD.outputDataSample, model.createResource(dataSampleIri));

        Resource defaultService = model.createResource(LPA.Dataset.uri + "defaultService");
        model.add(defaultService, RDF.type, SD.Service);
        model.add(defaultService, SD.endpoint, model.createResource(sparqlEndpointIri));

        Optional.ofNullable(namedGraph)
                .filter(graph -> !graph.isEmpty())
                .map(model::createResource)
                .map(graph -> model.createResource().addProperty(SD.name, graph))
                .map(blankNode -> model.createStatement(defaultService, SD.namedGraph, blankNode))
                .ifPresent(model::add);

        Resource defaultConfiguration = model.createResource(LPA.Dataset.uri + "defaultConfiguration");
        model.add(defaultConfiguration, RDF.type, LPDSparql.SparqlEndpointDataSourceConfiguration);
        model.add(defaultConfiguration, DCTerms.title, DATASET_CONFIG_TITLE);
        model.add(defaultConfiguration, LPD.service, defaultService);
        model.add(defaultConfiguration, LPD.query, extractorQuery);
        model.add(defaultConfiguration, LPD.configurationQuery, configurationQuery);

        Resource template = model.createResource(LPA.Dataset.uri + "template");
        model.add(template, RDF.type, LPD.DataSourceTemplate);
        model.add(template, DCTerms.title, DATASET_TEMPLATE_TITLE, "en");
        model.add(template, LPD.outputTemplate, output);
        model.add(template, LPD.componentConfigurationTemplate, defaultConfiguration);
        return model;
    }

    private static <E> Model createRgmlGraphModel(Map<E, Map<E, Integer>> weightedGraph) {
        RIOT.init();
        Model model = ModelFactory.createDefaultModel().setNsPrefixes(
                Map.of("generated", LPA.Generated.uri,
                        Prefixes.RDF_PREFIX, RDF.getURI(),
                        Prefixes.RGML_PREFIX, RGML.uri));

        model.add(LPA.Generated.graph, RDF.type, RGML.Graph);
        model.addLiteral(LPA.Generated.graph, RGML.directed, true);

        Set<E> allNodes = new HashSet<>(weightedGraph.keySet());
        weightedGraph.values()
                .stream()
                .map(Map::keySet)
                .forEach(allNodes::addAll);
        allNodes.stream()
                .map(Object::toString)
                .map(s -> LPA.Generated.uri + "node/" + s)
                .map(model::createResource)
                .forEach(resource -> model.add(resource, RDF.type, RGML.Node));

        for (var entry : weightedGraph.entrySet()) {
            String edgeSource = entry.getKey().toString();
            for (var innerEntry : entry.getValue().entrySet()) {
                String edgeTarget = innerEntry.getKey().toString();
                int edgeWeight = innerEntry.getValue();

                Resource edge = model.createResource(
                        LPA.Generated.uri + String.format("edge/%s/%s", edgeSource, edgeTarget));
                model.add(edge, RDF.type, RGML.Edge);
                model.add(edge, RGML.source, LPA.Generated.uri + "node/" + edgeSource);
                model.add(edge, RGML.target, LPA.Generated.uri + "node/" + edgeTarget);
                model.addLiteral(edge, RGML.weight, edgeWeight);
            }
        }

        return model;
    }

    @NotNull
    private static String writeModelToString(Model model) {
        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        return stringWriter.toString();
    }

}
