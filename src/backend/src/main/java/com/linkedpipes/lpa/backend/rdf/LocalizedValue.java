package com.linkedpipes.lpa.backend.rdf;

import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ext.com.google.common.collect.Lists;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

import java.util.HashMap;
import java.util.Map;

public class LocalizedValue {

    private Map<String, String> languageMap = new HashMap<>();

    public LocalizedValue(Map<String, String> variants){
        variants.forEach(this::put);
    }

    public LocalizedValue(String language, String localizedValue){
        put(language, localizedValue);
    }

    public LocalizedValue(String value){
        put(null, value);
    }

    public LocalizedValue(Literal literal){
        put(literal.getLanguage(), literal.getString());
    }

    public LocalizedValue(Resource resource, Property property){
        Lists.reverse(resource.listProperties(property).toList()).forEach(l -> put(l.getLanguage(), l.getString()));
    }

    public void put(String language, String localizedValue) {
        languageMap.put((StringUtils.isEmpty(language) ? "" : language), localizedValue);
    }

    public String get(String language) {
        return languageMap.get(language);
    }

    public int size() {
        return languageMap.size();
    }

}
