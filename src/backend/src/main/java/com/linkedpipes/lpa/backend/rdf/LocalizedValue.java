package com.linkedpipes.lpa.backend.rdf;

import org.apache.commons.lang3.StringUtils;
import org.apache.jena.rdf.model.Literal;

import java.util.HashMap;
import java.util.Map;

public class LocalizedValue {
    private Map<String, String> languageMap = new HashMap<>();

    public int size = languageMap.size();

    public LocalizedValue(Map<String, String> variants){
        variants.forEach((language, value) -> put(language, value));
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

    public void put(String language, String localizedValue) {
        languageMap.put((StringUtils.isEmpty(language) ? "" : language), localizedValue);
    }

    public String get(String language) {
        return languageMap.get(language);
    }
}
