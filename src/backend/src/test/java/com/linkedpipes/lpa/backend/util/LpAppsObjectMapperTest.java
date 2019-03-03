package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import java.text.SimpleDateFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class LpAppsObjectMapperTests {
    @Test
    public void testEtlStatus() throws LpAppsException {
        LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
                new ObjectMapper().setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

        String statusMessage = "{\n\t " +
            "\"status\":{\n\t\t" +
                "\"id\": \"http://etl.linkedpipes.com/resources/status/finished\"\n\t" +
            "},\n\t" +
            "\"executionStarted\": \"2019-01-18T20:53:50.625+0000\",\n\t" +
            "\"executionFinished\": \"2019-01-18T20:53:57.379+0000\"\n" +
        "}";

        ExecutionStatus executionStatus = OBJECT_MAPPER.readValue(statusMessage, ExecutionStatus.class);

        assertEquals(EtlStatus.FINISHED, executionStatus.status);
        assertFalse(executionStatus.status.isPollable());
    }
}
