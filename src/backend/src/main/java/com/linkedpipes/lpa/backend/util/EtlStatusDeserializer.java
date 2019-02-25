package com.linkedpipes.lpa.backend.util;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import java.io.IOException;

public class EtlStatusDeserializer extends JsonDeserializer<EtlStatus> {
    @Override
    public EtlStatus deserialize(JsonParser parser, DeserializationContext deserializer) throws IOException {
        ObjectCodec codec = parser.getCodec();
        JsonNode node = codec.readTree(parser);
        JsonNode id = node.get("@id");
        String iri = id.asText();
        return EtlStatus.fromIri(iri);
   }
}
