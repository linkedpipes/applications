package com.linkedpipes.lpa.backend.rdf;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ext.com.google.common.collect.Lists;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.ANY;

@JsonAutoDetect(fieldVisibility = ANY)
public class LocalizedValue {

    private final Map<String, String> languageMap = new HashMap<>();

    public static String noLanguageLabel = "nolang";

    public LocalizedValue() {
    }

    public LocalizedValue(Map<String, String> variants){
        variants.forEach(this::put);
    }

    public LocalizedValue(String language, String localizedValue){
        put(language, localizedValue);
    }

    public LocalizedValue(String value){
        put(noLanguageLabel, value);
    }

    public LocalizedValue(Literal literal){
        put(literal.getLanguage(), literal.getString());
    }

    public LocalizedValue(Resource resource, Property property) {
        Lists.reverse(resource.listProperties(property).toList()).forEach(l -> put(l.getLanguage(), l.getString()));
    }

    public LocalizedValue(List<Literal> literals) {
        literals.forEach(l -> put(l.getLanguage(), l.getString()));
    }

    public void put(String language, String localizedValue) {
        languageMap.put((StringUtils.isEmpty(language) ? noLanguageLabel : language), localizedValue);
    }

    public String get(String language) {
        return languageMap.get(language);
    }

    public int size() {
        return languageMap.size();
    }

    public LocalizedValue withDefault(@NotNull LocalizedValue defaultValues) {
        defaultValues.languageMap.forEach(this.languageMap::putIfAbsent);
        return this;
    }

}
