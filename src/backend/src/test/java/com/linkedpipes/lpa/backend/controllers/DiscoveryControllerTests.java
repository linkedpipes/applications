package com.linkedpipes.lpa.backend.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.services.UserService;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import com.linkedpipes.lpa.backend.testutil.TestError;
import com.linkedpipes.lpa.backend.util.LpAppsObjectMapper;
import com.linkedpipes.lpa.backend.util.ThrowableUtils;
import org.junit.BeforeClass;
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

    private static final String USER_ID = "xyz";

    private final DiscoveryController discoveryController;
    private final UserService userService;

    private DiscoveryControllerTests(ApplicationContext context) {
        discoveryController = context.getBean(DiscoveryController.class);
        userService = context.getBean(UserService.class);
    }

    @BeforeClass
    public void setUpUser() {
        try {
            userService.addUser(USER_ID);
        } catch(UserTakenException e) {
            //User already exists, thats ok on testing DB
        }
    }

    @Test
    void testStartDiscoveryNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscovery(USER_ID, null));
    }

    @Test
    void testStartDiscoveryEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscovery(USER_ID, List.of()));
    }

    @Test
    void testStartDiscoveryFakeUri() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscovery(USER_ID, FAKE_DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscovery() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscovery(USER_ID, DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscoveryFromInputNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(USER_ID, null));
    }

    @Test
    void testStartDiscoveryFromInputEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(USER_ID, ""));
    }

    @Test
    void testStartDiscoveryFromInputFakeConfig() {
        assertThrows(LpAppsException.class, () ->
                discoveryController.startDiscoveryFromInput(USER_ID, "This is a fake Discovery configuration."));
    }

    @Test
    void testStartDiscoveryFromInput() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscoveryFromInput(USER_ID, DISCOVERY_CONFIG);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscoveryFromInputIriNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInputIri(USER_ID, null));
    }

    @Test
    void testStartDiscoveryFromInputIriEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInputIri(USER_ID, ""));
    }

    @Test
    void testStartDiscoveryFromInputIriFake() {
        assertThrows(LpAppsException.class, () ->
                discoveryController.startDiscoveryFromInputIri(USER_ID, "This is a fake Discovery IRI."));
    }

    @Test
    void testStartDiscoveryFromInputIri() throws LpAppsException {
        ResponseEntity<?> response = discoveryController.startDiscoveryFromInputIri(USER_ID, DISCOVERY_CONFIG_IRI);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }


}
