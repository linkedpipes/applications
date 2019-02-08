package com.linkedpipes.lpa.backend.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.testutil.TestError;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import com.linkedpipes.lpa.backend.util.ThrowableUtils;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StreamUtils;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Tag("integration")
@ExtendWith(SpringExtension.class)
@SpringBootTest
class DiscoveryControllerTests {

    private static final List<DataSource> FAKE_DISCOVERY_DATA_SOURCES = List.of(
            new DataSource() {{
                uri = "http://this.is.a.fake.uri.com";
            }}
    );

    private static final List<DataSource> DISCOVERY_DATA_SOURCES;

    static {
        try {
            DISCOVERY_DATA_SOURCES = new LpAppsObjectMapper(new ObjectMapper()).readValue(
                    ThrowableUtils.rethrowAsUnchecked(() ->
                            StreamUtils.copyToString(
                                    DiscoveryControllerTests.class.getResourceAsStream("discovery.data.sources.json"),
                                    Application.DEFAULT_CHARSET
                            )
                    ),
                    new TypeReference<ArrayList<DataSource>>() {
                    }
            );
        } catch (LpAppsException e) {
            throw new TestError(e);
        }
    }

    private static final String DISCOVERY_CONFIG = ThrowableUtils.rethrowAsUnchecked(() ->
            StreamUtils.copyToString(DiscoveryControllerTests.class.getResourceAsStream("discovery.config.rdf"),
                    Application.DEFAULT_CHARSET));

    private static final String DISCOVERY_CONFIG_IRI = "https://github.com/linkedpipes/discovery/blob/master/data/rdf/discovery-input/discovery/dbpedia-03/config.ttl";

    private static final String NULL_DISCOVERY_ID = "00000000-0000-0000-0000-000000000000";
    private static final String FAKE_DISCOVERY_ID = "12345678-90ab-cdef-ghij-klmnopqrstuv";
    
    private final DiscoveryController discoveryController;
    
    private DiscoveryControllerTests(ApplicationContext context) {
        discoveryController = context.getBean(DiscoveryController.class);
    }

    @Test
    void testStartDiscoveryNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscovery(null));
    }

    @Test
    void testStartDiscoveryEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscovery(List.of()));
    }

    @Test
    void testStartDiscoveryFakeUri() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscovery(FAKE_DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscovery() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscovery(DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscoveryFromInputNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(null));
    }

    @Test
    void testStartDiscoveryFromInputEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(""));
    }

    @Test
    void testStartDiscoveryFromInputFakeConfig() {
        assertThrows(LpAppsException.class, () ->
                discoveryController.startDiscoveryFromInput("This is a fake Discovery configuration."));
    }

    @Test
    void testStartDiscoveryFromInput() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscoveryFromInput(DISCOVERY_CONFIG);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscoveryFromInputIriNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInputIri(null));
    }

    @Test
    void testStartDiscoveryFromInputIriEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInputIri(""));
    }

    @Test
    void testStartDiscoveryFromInputIriFake() {
        assertThrows(LpAppsException.class, () ->
                discoveryController.startDiscoveryFromInputIri("This is a fake Discovery IRI."));
    }

    @Test
    void testStartDiscoveryFromInputIri() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscoveryFromInputIri(DISCOVERY_CONFIG_IRI);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testGetStatusNullId() throws LpAppsException {
        String statusString = discoveryController.getDiscoveryStatus(NULL_DISCOVERY_ID).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertEquals("null", statusString);
    }

    @Test
    void testGetStatusFakeId() {
        assertThrows(LpAppsException.class, () -> discoveryController.getDiscoveryStatus(FAKE_DISCOVERY_ID));
    }

    @Test
    void testStartDiscoveryGetStatus() throws LpAppsException {
        ResponseEntity<?> startResponse = discoveryController.startDiscovery(DISCOVERY_DATA_SOURCES);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = discoveryController.getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

    @Test
    void testStartDiscoveryFromInputGetStatus() throws LpAppsException {
        ResponseEntity<?> startResponse = discoveryController.startDiscoveryFromInput(DISCOVERY_CONFIG);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = discoveryController.getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

    @Test
    void testStartDiscoveryFromInputIriGetStatus() throws LpAppsException {
        ResponseEntity<?> startResponse = discoveryController.startDiscoveryFromInputIri(DISCOVERY_CONFIG_IRI);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = discoveryController.getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

}
