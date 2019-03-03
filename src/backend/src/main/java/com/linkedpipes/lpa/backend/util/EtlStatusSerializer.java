package com.linkedpipes.lpa.backend.util;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;


public class EtlStatusSerializer extends JsonSerializer<EtlStatus> {
    @Override
    public void serialize(EtlStatus value, JsonGenerator generator,
           SerializerProvider provider) throws IOException,
           JsonProcessingException {
       generator.writeStartObject();
       generator.writeFieldName("id");
       generator.writeString(value.getStatusIri());
       generator.writeEndObject();
   }
}
