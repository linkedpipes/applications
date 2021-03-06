package com.linkedpipes.lpa.backend.services;
import com.linkedpipes.lpa.backend.util.rdfbuilder.ModelBuilder;
import com.linkedpipes.lpa.backend.util.rdfbuilder.ResourceBuilder;
import org.apache.jena.rdf.model.ResourceFactory;
import java.util.UUID;


public class DataSamplePipelineInputGenerator {
        public static String getDataSamplePipelineInput(String graphIri, String virtuosoEndpointIri) {
            ModelBuilder modelBuilder = ModelBuilder.empty().namespace("etl", "http://linked.opendata.cz/ontology/adhoc/");
            ResourceBuilder resourceBuilder = modelBuilder.resource("https://applications.linkedpipes.com/ds-" + UUID.randomUUID().toString());
            resourceBuilder.property(ResourceFactory.createProperty("http://linked.opendata.cz/ontology/adhoc/ep"), virtuosoEndpointIri);
            resourceBuilder.property(ResourceFactory.createProperty("http://linked.opendata.cz/ontology/adhoc/defaultGraphIri"), graphIri);
            return modelBuilder.toString();
        }
}
