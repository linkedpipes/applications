package com.linkedpipes.lpa.backend.services;

import com.linkedpipes.lpa.backend.entities.DataSource;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RIOT;

import java.io.*;
import java.util.List;

public class TtlConfigGenerator {

    public static String fromDataSourceList(List<DataSource> dataSourceList) throws FileNotFoundException {
        RIOT.init() ;

        // create an empty model
        Model model = ModelFactory.createDefaultModel();

        //read base rdf from file
        final File baseTtlFile = new File("src/data/rdf/base.ttl");
        final InputStream fileStream = new DataInputStream(new FileInputStream(baseTtlFile));
        model.read(fileStream, "", "TURTLE");

        //add data sources
        Resource subject = model.createResource("https://discovery.linkedpipes.com/resource/discovery/all-and-generated/config");
        Property property = model.createProperty("https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate");

        for (DataSource dataSource : dataSourceList) {
            Resource obj = model.createResource(dataSource.Uri);
            model.add(subject, property, obj);
        }

        StringWriter stringWriter = new StringWriter();
        RDFDataMgr.write(stringWriter, model, RDFFormat.TURTLE_PRETTY);
        return stringWriter.toString();
    }

}
