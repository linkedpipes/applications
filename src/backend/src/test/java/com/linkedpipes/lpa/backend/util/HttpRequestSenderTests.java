package com.linkedpipes.lpa.backend.util;

import org.junit.Test;

import java.io.IOException;
import java.net.MalformedURLException;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static com.linkedpipes.lpa.backend.testutil.TestUtils.invoke;
import static org.junit.Assert.assertEquals;

public class HttpRequestSenderTests {

    private static final String GOOGLE_URL = "http://www.google.com/";
    private static final String GET_URL_WITH_PARAMETERS = "getUrlWithParameters";
    private static final Class[] PARAMETER_TYPES_EMPTY = new Class[]{};

    @Test
    public void testSend() {
        HttpRequestSender sender = new HttpRequestSender();
        assertThrowsExactly(IllegalStateException.class, sender::send);
    }

    @Test
    public void testToNull() {
        HttpRequestSender sender = new HttpRequestSender().to(null);
        assertThrowsExactly(IllegalStateException.class, sender::send);
    }

    @Test
    public void testToEmpty() {
        HttpRequestSender sender = new HttpRequestSender().to("");
        assertThrowsExactly(MalformedURLException.class, sender::send);
    }

    @Test
    public void testToGoogle() throws IOException {
        new HttpRequestSender().to(GOOGLE_URL).send(); // implicit no-throw assert
    }

    @Test
    public void testSendWithNoParameters() {
        HttpRequestSender sender = new HttpRequestSender().to(GOOGLE_URL);
        String urlWithParameters = (String) invoke(sender, GET_URL_WITH_PARAMETERS, PARAMETER_TYPES_EMPTY);
        assertEquals(GOOGLE_URL, urlWithParameters);
    }

    @Test
    public void testSendWithOneParameter() {
        HttpRequestSender sender = new HttpRequestSender()
                .to(GOOGLE_URL)
                .parameter("param", "value");
        String urlWithParameters = (String) invoke(sender, GET_URL_WITH_PARAMETERS, PARAMETER_TYPES_EMPTY);
        assertEquals(GOOGLE_URL + "?param=value", urlWithParameters);
    }

    @Test
    public void testSendWithTwoParameters() {
        HttpRequestSender sender = new HttpRequestSender()
                .to(GOOGLE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2");
        String urlWithParameters = (String) invoke(sender, GET_URL_WITH_PARAMETERS, PARAMETER_TYPES_EMPTY);
        assertEquals(GOOGLE_URL + "?param1=value1&param2=value2", urlWithParameters);
    }

    @Test
    public void testSendWithManyParameters() {
        HttpRequestSender sender = new HttpRequestSender()
                .to(GOOGLE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5");
        String urlWithParameters = (String) invoke(sender, GET_URL_WITH_PARAMETERS, PARAMETER_TYPES_EMPTY);
        assertEquals(GOOGLE_URL + "?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

    @Test
    public void testSendAfterResettingParameters() {
        HttpRequestSender sender = new HttpRequestSender()
                .to(GOOGLE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5")

                .parameter("param1", "value6");

        String urlWithParameters = (String) invoke(sender, GET_URL_WITH_PARAMETERS, PARAMETER_TYPES_EMPTY);
        assertEquals(GOOGLE_URL + "?param1=value6&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

}
