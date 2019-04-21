package com.linkedpipes.lpa.backend.services

import com.linkedpipes.lpa.backend.entities.DataSource
import com.linkedpipes.lpa.backend.rdf.Prefixes
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPA
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPD
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPDSparql
import com.linkedpipes.lpa.backend.rdf.vocabulary.SD
import com.linkedpipes.lpa.backend.services.DiscoveryServiceComponent;
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceConfigurationQueryProvider
import com.linkedpipes.lpa.backend.sparql.queries.DefaultDataSourceExtractorQueryProvider
import com.linkedpipes.lpa.backend.sparql.queries.SparqlQueryProvider
import com.linkedpipes.lpa.backend.util.rdfbuilder.ModelBuilder
import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.Property
import org.apache.jena.riot.RDFDataMgr
import org.apache.jena.riot.RDFFormat
import org.apache.jena.vocabulary.DCTerms
import org.apache.jena.vocabulary.RDF
import org.jetbrains.annotations.NotNull
import org.jetbrains.annotations.Nullable

class TtlGenerator {

    private static final String DATASET_OUTPUT_TITLE = "Unspecified user-provided dataset output"
    private static final String DATASET_CONFIG_TITLE = "Unspecified user-provided dataset default configuration"

    private static final SparqlQueryProvider EXTRACTOR_QUERY_PROVIDER = new DefaultDataSourceExtractorQueryProvider()
    private static final SparqlQueryProvider CONFIGURATION_QUERY_PROVIDER = new DefaultDataSourceConfigurationQueryProvider()

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
        ModelBuilder.from(TtlGenerator.class.getResourceAsStream("base.ttl")) {
            resource("https://discovery.linkedpipes.com/resource/discovery/all-and-generated/config") {
                dataSourceList.uri.each {
                    prop "https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate", resource(it)
                }
            }
        }.build()
    }

    @NotNull
    private static Model getTemplateDescriptionModel(@NotNull String sparqlEndpointIri, @NotNull String dataSampleIri,
                                                     @NotNull String extractorQuery, @NotNull String configurationQuery,
                                                     @Nullable String namedGraph) {
        ModelBuilder.from {
            namespaces(
                    dataset: LPA.Dataset.uri,
                    lpd: LPD.uri,
                    (Prefixes.DCTERMS_PREFIX): DCTerms.getURI(),
                    "lpd-sparql": LPDSparql.uri,
                    (Prefixes.SD_PREFIX): SD.uri,
            )

            resource(LPA.Dataset.template) {
                props(
                        (RDF.type): LPD.DataSourceTemplate,
                        (LPD.outputTemplate): resource(LPA.Dataset.output, [
                                (RDF.type)            : LPD.OutputDataPortTemplate,
                                (DCTerms.title)       : DATASET_OUTPUT_TITLE,
                                (LPD.outputDataSample): resource(dataSampleIri),
                        ]),
                        (LPD.componentConfigurationTemplate): resource(LPA.Dataset.defaultConfiguration, [
                                (RDF.type)              : LPDSparql.SparqlEndpointDataSourceConfiguration,
                                (DCTerms.title)         : DATASET_CONFIG_TITLE,
                                (LPD.service)           : resource(LPA.Dataset.defaultService) {
                                    props(
                                            (RDF.type): SD.Service,
                                            (SD.endpoint): resource(sparqlEndpointIri),
                                    )

                                    if (namedGraph != null && !namedGraph.isEmpty()) {
                                        prop SD.namedGraph, resource(
                                                (SD.name as Property): resource(namedGraph),
                                        )
                                    }
                                },
                                (LPD.query)             : extractorQuery,
                                (LPD.configurationQuery): configurationQuery,
                        ])
                )
                prop DCTerms.title, DiscoveryServiceComponent.OUR_DATASET_TEMPLATE_TITLE, "en"
            }
        }.build()
    }

    @NotNull
    private static String writeModelToString(Model model) {
        StringWriter stringWriter = new StringWriter()
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY)
        return stringWriter.toString()
    }

}
