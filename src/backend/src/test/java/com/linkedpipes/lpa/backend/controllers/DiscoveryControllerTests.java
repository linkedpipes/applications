package com.linkedpipes.lpa.backend.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.services.UserService;
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

    private static final String TEST_TREEMAP_DATA_SAMPLE_URI = "https://gist.githubusercontent.com/ivan-lattak/63801f3e6a9e6105aada4c207d0f8abb/raw/aa2a805a4b14da6fd30711532c4f58692018665b/cpv-2008_sample.ttl";
    private static final String TEST_TREEMAP_NAMED_GRAPH_URI = "http://linked.opendata.cz/resource/dataset/cpv-2008";
    private static final String TEST_TREEMAP_SPARQL_IRI = "https://linked.opendata.cz/sparql";
    private static final String USER_ID = "xyz";

    private final DiscoveryController discoveryController;
    private final UserService userService;

    private DiscoveryControllerTests(ApplicationContext context) {
        discoveryController = context.getBean(DiscoveryController.class);
        userService = context.getBean(UserService.class);
    }

    @BeforeClass
    public void setUpUser() {
        userService.addUserIfNotPresent(USER_ID);
    }

    @Test
    void testStartDiscoveryFromEndpoint() throws LpAppsException{
        ResponseEntity<?> response = discoveryController.startDiscoveryFromEndpoint(TEST_TREEMAP_SPARQL_IRI,
                TEST_TREEMAP_DATA_SAMPLE_URI, USER_ID, List.of(TEST_TREEMAP_NAMED_GRAPH_URI));
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    void testStartDiscoveryFromInputNull() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(USER_ID, null, null,null));
    }

    @Test
    void testStartDiscoveryFromInputEmpty() {
        assertThrows(LpAppsException.class, () -> discoveryController.startDiscoveryFromInput(USER_ID, "", "", null));
    }

    @Test
    void testStartDiscoveryFromInputIriFake() {
        assertThrows(LpAppsException.class, () ->
                discoveryController.startDiscoveryFromInputIri(USER_ID, "This is a fake Discovery IRI.", TEST_TREEMAP_DATA_SAMPLE_URI));
    }

}
