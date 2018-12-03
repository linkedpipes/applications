package com.linkedpipes.lpa.backend.controllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.util.ConnectionException;
import com.linkedpipes.lpa.backend.util.ThrowableUtils;
import org.junit.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static org.junit.Assert.*;

public class DiscoveryControllerTests {

    private static final List<DataSource> FAKE_DISCOVERY_DATA_SOURCES = List.of(
            new DataSource() {{
                uri = "http://this.is.a.fake.uri.com";
            }}
    );

    private static final Type dataSourcesType = new TypeToken<ArrayList<DataSource>>() {
    }.getType();
    private static final List<DataSource> DISCOVERY_DATA_SOURCES = new Gson().fromJson(
            ThrowableUtils.rethrowAsUnchecked(() ->
                    StreamUtils.copyToString(
                            DiscoveryControllerTests.class.getResourceAsStream("discovery.data.sources.json"),
                            Application.DEFAULT_CHARSET
                    )
            ),
            dataSourcesType
    );

    private static final String DISCOVERY_CONFIG = ThrowableUtils.rethrowAsUnchecked(() ->
            StreamUtils.copyToString(DiscoveryControllerTests.class.getResourceAsStream("discovery.config.rdf"),
                    Application.DEFAULT_CHARSET));

    private static final String DISCOVERY_CONFIG_IRI = "https://github.com/linkedpipes/discovery/blob/master/data/rdf/discovery-input/discovery/dbpedia-03/config.ttl";

    private static final String NULL_DISCOVERY_ID = "00000000-0000-0000-0000-000000000000";
    private static final String FAKE_DISCOVERY_ID = "12345678-90ab-cdef-ghij-klmnopqrstuv";

    @Test
    public void testStartDiscoveryNull() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscovery(null);
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryEmpty() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscovery(List.of());
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryFakeUri() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscovery(FAKE_DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    public void testStartDiscovery() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscovery(DISCOVERY_DATA_SOURCES);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    public void testStartDiscoveryFromInputNull() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInput(null);
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryFromInputEmpty() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInput("");
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryFromInputFakeConfig() {
        DiscoveryController controller = new DiscoveryController();
        assertThrowsExactly(ConnectionException.class, () ->
                controller.startDiscoveryFromInput("This is a fake Discovery configuration."));
    }

    @Test
    public void testStartDiscoveryFromInput() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInput(DISCOVERY_CONFIG);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    public void testStartDiscoveryFromInputIriNull() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInputIri(null);
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryFromInputIriEmpty() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInputIri("");
        assertTrue(response.getStatusCode().isError());
    }

    @Test
    public void testStartDiscoveryFromInputIriFake() {
        DiscoveryController controller = new DiscoveryController();
        assertThrowsExactly(ConnectionException.class, () ->
                controller.startDiscoveryFromInputIri("This is a fake Discovery IRI."));
    }

    @Test
    public void testStartDiscoveryFromInputIri() throws IOException {
        ResponseEntity<?> response = new DiscoveryController().startDiscoveryFromInputIri(DISCOVERY_CONFIG_IRI);
        assertFalse(response.getStatusCode().isError());

        Object responseBody = response.getBody();
        assertTrue(responseBody instanceof Discovery);
        assertNotNull(((Discovery) responseBody).id);
    }

    @Test
    public void testGetStatusNullId() throws IOException {
        String statusString = new DiscoveryController().getDiscoveryStatus(NULL_DISCOVERY_ID).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertEquals("null", statusString);
    }

    @Test
    public void testGetStatusFakeId() {
        DiscoveryController controller = new DiscoveryController();
        assertThrowsExactly(ConnectionException.class, () -> controller.getDiscoveryStatus(FAKE_DISCOVERY_ID));
    }

    @Test
    public void testStartDiscoveryGetStatus() throws IOException {
        ResponseEntity<?> startResponse = new DiscoveryController().startDiscovery(DISCOVERY_DATA_SOURCES);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = new DiscoveryController().getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

    @Test
    public void testStartDiscoveryFromInputGetStatus() throws IOException {
        ResponseEntity<?> startResponse = new DiscoveryController().startDiscoveryFromInput(DISCOVERY_CONFIG);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = new DiscoveryController().getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

    @Test
    public void testStartDiscoveryFromInputIriGetStatus() throws IOException {
        ResponseEntity<?> startResponse = new DiscoveryController().startDiscoveryFromInputIri(DISCOVERY_CONFIG_IRI);
        assertFalse(startResponse.getStatusCode().isError());

        Object responseBody = startResponse.getBody();
        assertTrue(responseBody instanceof Discovery);

        String discoveryId = ((Discovery) responseBody).id;
        assertNotNull(discoveryId);

        String statusString = new DiscoveryController().getDiscoveryStatus(discoveryId).getBody();
        assertNotNull(statusString);
        assertFalse(statusString.isEmpty());
        assertNotEquals("null", statusString);
    }

}
