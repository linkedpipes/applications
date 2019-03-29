package com.linkedpipes.lpa.backend.services

import com.linkedpipes.lpa.backend.entities.DataSource
import com.linkedpipes.lpa.backend.rdf.Prefixes
import com.linkedpipes.lpa.backend.rdf.vocabulary.*
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceConfigurationQueryProvider
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceExtractorQueryProvider
import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.ModelFactory
import org.apache.jena.rdf.model.Property
import org.apache.jena.rdf.model.Resource
import org.apache.jena.riot.RDFDataMgr
import org.apache.jena.riot.RDFFormat
import org.apache.jena.riot.RIOT
import org.apache.jena.vocabulary.DCTerms
import org.apache.jena.vocabulary.RDF
import org.jetbrains.annotations.NotNull
import org.jetbrains.annotations.Nullable

class TtlGenerator {

    private static final String DATASET_TEMPLATE_TITLE = "Unspecified user-provided dataset template"
    private static final String DATASET_OUTPUT_TITLE = "Unspecified user-provided dataset output"
    private static final String DATASET_CONFIG_TITLE = "Unspecified user-provided dataset default configuration"

    private static final EXTRACTOR_QUERY_PROVIDER = new DefaultDataSourceExtractorQueryProvider()
    private static final CONFIGURATION_QUERY_PROVIDER = new DefaultDataSourceConfigurationQueryProvider()

    @NotNull
    static String getDiscoveryConfig(@NotNull List<DataSource> dataSourceList) {
        return writeModelToString(getDiscoveryConfigModel(dataSourceList))
    }

    @NotNull
    static String getTemplateDescription(@NotNull String sparqlEndpointIri,
                                         @NotNull String dataSampleIri,
                                         @Nullable String namedGraph) {
        String extractorQuery = EXTRACTOR_QUERY_PROVIDER.get().toString()
        String configurationQuery = CONFIGURATION_QUERY_PROVIDER.get().toString()

        return writeModelToString(
                getTemplateDescriptionModel(sparqlEndpointIri, dataSampleIri,
                        extractorQuery, configurationQuery, namedGraph))
    }

    @NotNull
    private static Model getDiscoveryConfigModel(@NotNull List<DataSource> dataSourceList) {
        RIOT.init()

        // create an empty model
        Model model = ModelFactory.createDefaultModel()

        //read base rdf from resource
        InputStream fileStream = new DataInputStream(TtlGenerator.class.getResourceAsStream("base.ttl"))
        model.read(fileStream, "", "TURTLE")

        //add data sources
        Resource subject = model.createResource("https://discovery.linkedpipes.com/resource/discovery/all-and-generated/config")
        Property property = model.createProperty("https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate")

        /*
        dataSourceList.stream()
                .map(dataSource -> dataSource.uri)
                .map(model::createResource)
                .forEach(resource -> model.add(subject, property, resource))
                */
        return model
    }

    @NotNull
    private static Model getTemplateDescriptionModel(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri,
                                                     @NotNull String extractorQuery, @NotNull String configurationQuery,
                                                     @Nullable String namedGraph) {
        ModelBuilder.create {
            prefixes (
                    dataset: LPA.Dataset.uri,
                    lpd: LPD.uri,
                    (Prefixes.DCTERMS_PREFIX): DCTerms.getURI(),
                    "lpd-sparql": LPDSparql.uri,
                    sd: SD.uri
            )

            resource (LPA.Dataset.uri + "template") {
                props (
                        (RDF.type): LPD.DataSourceTemplate,
                        (LPD.outputTemplate): resource (LPA.Dataset.uri + "output") {
                            props (
                                    (RDF.type): LPD.OutputDataPortTemplate,
                                    (DCTerms.title): DATASET_OUTPUT_TITLE,
                                    (LPD.outputDataSample): resource(dataSampleIri)
                            )
                        },
                        (LPD.componentConfigurationTemplate): resource (LPA.Dataset.uri + "defaultConfiguration") {
                            props (
                                    (RDF.type): LPDSparql.SparqlEndpointDataSourceConfiguration,
                                    (DCTerms.title): DATASET_CONFIG_TITLE,
                                    (LPD.query): extractorQuery,
                                    (LPD.configurationQuery): configurationQuery,
                                    (LPD.service): resource (LPA.Dataset.uri + "defaultService") {
                                        props (
                                                (RDF.type): SD.Service,
                                                (SD.endpoint): resource(sparqlEndpointIri)
                                        )

                                        if (namedGraph != null && !namedGraph.isEmpty()) {
                                            prop SD.namedGraph, resource {
                                                prop SD.name, namedGraph
                                            }
                                        }
                                    }
                            )
                        }
                )
                prop DCTerms.title, DATASET_TEMPLATE_TITLE, "en"
            }
        }.build()
    }

    /*
    @NotNull
    private static Model getTemplateDescriptionModel(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri,
                                                     @NotNull String extractorQuery, @NotNull String configurationQuery,
                                                     @Nullable String namedGraph) {
        Resource template = model.createResource(LPA.Dataset.uri + "template")
        model.add(template, RDF.type, LPD.DataSourceTemplate)
        model.add(template, DCTerms.title, DATASET_TEMPLATE_TITLE, "en")
        model.add(template, LPD.outputTemplate, output)
        model.add(template, LPD.componentConfigurationTemplate, defaultConfiguration)
        return model
    }
    */

    @NotNull
    private static String writeModelToString(Model model) {
        StringWriter stringWriter = new StringWriter()
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY)
        return stringWriter.toString()
    }

    static void main(String[] args) {
        println(getTemplateDescription("sparqlEndpoint", "dataSample", "namedGraph"))
    }

}
