package com.linkedpipes.lpa.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.entities.EtlStatus;
import com.linkedpipes.lpa.backend.entities.ExecutionStatus;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.text.SimpleDateFormat;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.params.provider.Arguments.arguments;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class LpAppsObjectMapperTests {

    private static final LpAppsObjectMapper OBJECT_MAPPER = new LpAppsObjectMapper(
            new ObjectMapper().setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")));

    @ParameterizedTest
    @MethodSource("testExecutionStatusArgs")
    void testExecutionStatus(String statusMessage, EtlStatus expectedStatus, boolean startedNull, boolean finishedNull) throws LpAppsException {
        ExecutionStatus executionStatus = OBJECT_MAPPER.readValue(statusMessage, ExecutionStatus.class);

        assertSame(expectedStatus, executionStatus.status);
        assertSame(startedNull, executionStatus.started == null);
        assertSame(finishedNull, executionStatus.finished == null);
    }

    private static Stream<Arguments> testExecutionStatusArgs() {
        return Stream.of(
                arguments("{\"status\":{\"@id\":\"http://etl.linkedpipes.com/resources/status/finished\"}," +
                        "\"executionStarted\":\"2019-01-18T20:53:50.625+0000\"," +
                        "\"executionFinished\":\"2019-01-18T20:53:57.379+0000\"}", EtlStatus.FINISHED, false, false),
                arguments("{\"status\":{\"@id\":\"http://etl.linkedpipes.com/resources/status/running\"}," +
                        "\"executionStarted\":\"2019-01-18T20:53:50.625+0000\",", EtlStatus.RUNNING, false, true),
                arguments("{\"status\":{\"@id\":\"http://etl.linkedpipes.com/resources/status/queued\"}}", EtlStatus.QUEUED, true, true)
        );
    }

}
