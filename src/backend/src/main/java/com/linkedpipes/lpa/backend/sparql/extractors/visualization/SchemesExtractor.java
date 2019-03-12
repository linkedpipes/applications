package com.linkedpipes.lpa.backend.sparql.extractors.visualization;

import com.linkedpipes.lpa.backend.entities.visualization.Scheme;
import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.SKOS;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

//https://github.com/ldvm/LDVMi/blob/master/src/app/model/rdf/sparql/visualization/extractor/SchemesExtractor.scala
public class SchemesExtractor {

    private final Property[] possibleLabels = {SKOS.prefLabel, DCTerms.title, RDFS.label};

    public List<Scheme> extract(QueryExecution queryExec){
        Model model = queryExec.execConstruct();
        return model.listResourcesWithProperty(RDF.type, SKOS.ConceptScheme)
                .toList()
                .stream()
                .map(schemeResource -> {
                    Stream<Literal> literals = reversed(
                            Arrays.stream(possibleLabels)
                                    .flatMap(labelProperty -> {
                                        List<Statement> props = schemeResource.listProperties(labelProperty).toList();
                                        return props.stream().map(Statement::getLiteral);
                                    })
                    );

                    Map<String, String> map = literals
                            .collect(toMap(Literal::getLanguage, Literal::getString));
                    LocalizedValue localizedLabel = map.isEmpty() ?
                            new LocalizedValue(Map.of(
                                    LocalizedValue.noLanguageLabel,
                                    reversed(Arrays.stream(schemeResource.getURI().split("[/#]"))).findFirst().orElse(schemeResource.getURI()))) :
                            new LocalizedValue(map);

                    return new Scheme(schemeResource.getURI(), localizedLabel, null);
                })
                .collect(toList());
    }

    @SuppressWarnings("unchecked")
    private static <T> Stream<T> reversed(Stream<T> input) {
        Object[] buffer = input.toArray();
        return (Stream<T>) IntStream.range(0, buffer.length)
                .mapToObj(i -> buffer[buffer.length - i - 1]);
    }

}
