package com.linkedpipes.lpa.backend.rdf;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.rdf.model.Literal;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonSerialize(using = LocalizedValue.Serializer.class)
public class LocalizedValue {

    private final Map<String, String> languageMap = new HashMap<>();

    public static String noLanguageLabel = "nolang";

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

    public static class Serializer extends StdSerializer<LocalizedValue> {

        public Serializer() {
            super((Class<LocalizedValue>) null);
        }

        @Override
        public void serialize(LocalizedValue value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartObject();
            gen.writeObjectField("languageMap", value.languageMap);
            gen.writeEndObject();
        }

    }

}
