package com.linkedpipes.lpa.backend.sparql.extractors.geo;

import com.linkedpipes.lpa.backend.rdf.LocalizedValue;
import com.linkedpipes.lpa.backend.rdf.Property;
import com.linkedpipes.lpa.backend.sparql.extractors.SimpleQueryExecutionResultExtractor;
import com.linkedpipes.lpa.backend.sparql.queries.geo.GeoPropertiesQueryProvider;
import com.linkedpipes.lpa.backend.util.SparqlUtils;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Resource;

public class GeoPropertiesExtractor extends SimpleQueryExecutionResultExtractor<Property> {

    protected String getPropertyVariableName(){
        return GeoPropertiesQueryProvider.VAR_P;
    }

    public Property withResourceSolution(Resource res, QuerySolution qs){
        LocalizedValue label = SparqlUtils.getLabel(qs, GeoPropertiesQueryProvider.LABEL_VARIABLES);
        String schemeUri = qs.getResource(GeoPropertiesQueryProvider.VAR_SCHEME).getURI();
        return new Property(label, res.getURI(), schemeUri);
    }

    public Property withLiteralSolution(Literal literal){
        return new Property(SparqlUtils.localizedLabel(literal), null, null);
    }
}
