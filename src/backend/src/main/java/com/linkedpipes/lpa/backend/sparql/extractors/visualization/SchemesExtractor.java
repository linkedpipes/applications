package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

//https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/extractor/SchemesExtractor.scala
public class SchemesExtractor {
    private final Property[] possibleLabels = {SKOS.prefLabel, DCTerms.title, RDFS.label};

    public List<Scheme> extract(QueryExecution queryExec){

        List<Scheme> schemes = new ArrayList<>();
        Model model = queryExec.execConstruct();
        ResIterator resIter = model.listResourcesWithProperty(RDF.type, SKOS.ConceptScheme);

        while(resIter.hasNext()){
            Resource schemeResource = resIter.next().asResource();

            Stream<Literal> literals = Arrays.stream(possibleLabels).flatMap(labelProperty ->
                {
                    List<Statement> props = schemeResource.listProperties(labelProperty).toList();
                    return props.stream().map(a -> a.getLiteral());
        }
            );

            //TODO continue implementation
            //val map = literals.reverse.map(l => (l.getLanguage, l.getString)).toMap
            //        val localizedLabel = map.isEmpty match {
            //          case false => LocalizedValue(map)
            //          case true => LocalizedValue(Map(("nolang", schemeResource.getURI.split("[/#]").lastOption.getOrElse(schemeResource.getURI))))
            //        }

            schemes.add(new Scheme(schemeResource.getURI(), null, null));
        }

        return new ArrayList<>();
    }
}
