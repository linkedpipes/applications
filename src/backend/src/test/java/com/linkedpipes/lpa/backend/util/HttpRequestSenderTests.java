package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import org.junit.Test;

import java.io.IOException;
import java.net.MalformedURLException;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrows;
import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class HttpRequestSenderTests {

    private static final FakeHttpURLConnectionFactory FAKE_FACTORY = new FakeHttpURLConnectionFactory();

    private static final String GOOGLE_URL = "http://www.google.com/";
    private static final String FAKE_URL = "http://this.url.does.not.exist/";
    private static final String REQUEST_PROPERTY_CONTENT_TYPE = "Content-Type";
    private static final String REQUEST_PROPERTY_ACCEPT = "Accept";

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
        new HttpRequestSender().to(GOOGLE_URL).send(); // implicit assert that this call does not throw
    }

    @Test
    public void testToFake() {
        assertThrows(IOException.class, () -> new HttpRequestSender().to(FAKE_URL).send());
    }

    @Test
    public void testUrlWithNoParameters() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .send(FAKE_FACTORY);
        String urlWithParameters = FAKE_FACTORY.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL, urlWithParameters);
    }

    @Test
    public void testUrlWithOneParameter() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .parameter("param", "value")
                .send(FAKE_FACTORY);
        String urlWithParameters = FAKE_FACTORY.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param=value", urlWithParameters);
    }

    @Test
    public void testUrlWithTwoParameters() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .send(FAKE_FACTORY);
        String urlWithParameters = FAKE_FACTORY.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value1&param2=value2", urlWithParameters);
    }

    @Test
    public void testUrlWithManyParameters() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5")
                .send(FAKE_FACTORY);
        String urlWithParameters = FAKE_FACTORY.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

    @Test
    public void testUrlAfterResettingParameters() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5")

                .parameter("param1", "value6")
                .send(FAKE_FACTORY);

        String urlWithParameters = FAKE_FACTORY.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value6&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

    @Test
    public void testNoMethodSet() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .send(FAKE_FACTORY);

        String methodName = FAKE_FACTORY.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.GET.name(), methodName);
    }

    @Test
    public void testGetMethodSet() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .method(HttpRequestSender.HttpMethod.GET)
                .send(FAKE_FACTORY);

        String methodName = FAKE_FACTORY.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.GET.name(), methodName);
    }

    @Test
    public void testPostMethodSet() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .method(HttpRequestSender.HttpMethod.POST)
                .send(FAKE_FACTORY);

        String methodName = FAKE_FACTORY.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.POST.name(), methodName);
    }

    @Test
    public void testNoRequestBody() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .send(FAKE_FACTORY);

        String actualBody = FAKE_FACTORY.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals("", actualBody);
    }

    @Test
    public void testNullRequestBody() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .requestBody(null)
                .send(FAKE_FACTORY);

        String actualBody = FAKE_FACTORY.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals("", actualBody);
    }

    @Test
    public void testEmptyRequestBody() throws IOException {
        String expectedBody = "";

        new HttpRequestSender()
                .to(FAKE_URL)
                .requestBody(expectedBody)
                .send(FAKE_FACTORY);

        String actualBody = FAKE_FACTORY.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals(expectedBody, actualBody);
    }

    @Test
    public void testASCIIRequestBody() throws IOException {
        String expectedBody = "This is a request body with only ASCII characters.";

        new HttpRequestSender()
                .to(FAKE_URL)
                .requestBody(expectedBody)
                .send(FAKE_FACTORY);

        String actualBody = FAKE_FACTORY.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals(expectedBody, actualBody);
    }

    @Test
    public void testNonASCIIRequestBody() throws IOException {
        String expectedBody = "This is a request body with fůňńý čhäřáćťěřš";

        new HttpRequestSender()
                .to(FAKE_URL)
                .requestBody(expectedBody)
                .send(FAKE_FACTORY);

        String actualBody = FAKE_FACTORY.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals(expectedBody, actualBody);
    }

    @Test
    public void testNoContentType() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .send(FAKE_FACTORY);

        String actualContentType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertNull(actualContentType);
    }

    @Test
    public void testNullContentType() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .contentType(null)
                .send(FAKE_FACTORY);

        String actualContentType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertNull(actualContentType);
    }

    @Test
    public void testEmptyContentType() throws IOException {
        String expectedContentType = "";
        new HttpRequestSender()
                .to(FAKE_URL)
                .contentType(expectedContentType)
                .send(FAKE_FACTORY);

        String actualContentType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertEquals(expectedContentType, actualContentType);
    }

    @Test
    public void testContentType() throws IOException {
        String expectedContentType = "text/plain";
        new HttpRequestSender()
                .to(FAKE_URL)
                .contentType(expectedContentType)
                .send(FAKE_FACTORY);

        String actualContentType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertEquals(expectedContentType, actualContentType);
    }

    @Test
    public void testNoAcceptType() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .send(FAKE_FACTORY);

        String actualAcceptType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertNull(actualAcceptType);
    }

    @Test
    public void testNullAcceptType() throws IOException {
        new HttpRequestSender()
                .to(FAKE_URL)
                .acceptType(null)
                .send(FAKE_FACTORY);

        String actualAcceptType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertNull(actualAcceptType);
    }

    @Test
    public void testEmptyAcceptType() throws IOException {
        String expectedAcceptType = "";
        new HttpRequestSender()
                .to(FAKE_URL)
                .acceptType(expectedAcceptType)
                .send(FAKE_FACTORY);

        String actualAcceptType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertEquals(expectedAcceptType, actualAcceptType);
    }

    @Test
    public void testAcceptType() throws IOException {
        String expectedAcceptType = "text/plain";
        new HttpRequestSender()
                .to(FAKE_URL)
                .acceptType(expectedAcceptType)
                .send(FAKE_FACTORY);

        String actualAcceptType = FAKE_FACTORY.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertEquals(expectedAcceptType, actualAcceptType);
    }

}
