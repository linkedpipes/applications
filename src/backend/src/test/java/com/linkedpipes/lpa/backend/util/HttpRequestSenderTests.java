package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
class HttpRequestSenderTests {

    private static final String GOOGLE_URL = "http://www.google.com/";
    private static final String FAKE_URL = "http://this.url.does.not.exist/";
    private static final String REQUEST_PROPERTY_CONTENT_TYPE = "Content-Type";
    private static final String REQUEST_PROPERTY_ACCEPT = "Accept";

    private final ApplicationContext context;
    private final FakeHttpURLConnectionFactory fakeFactory;
    
    private HttpRequestSender sender;

    HttpRequestSenderTests(ApplicationContext context) {
        this.context = context;
        fakeFactory = (FakeHttpURLConnectionFactory) context.getBean(HttpURLConnectionFactory.class);
    }

    @BeforeEach
    void setUpSender() {
        sender = new HttpRequestSender(context);
    }

    @Test
    void testSend() {
        assertThrows(IllegalStateException.class, this.sender::send);
    }

    @Test
    void testToNull() {
        HttpRequestSender sender = this.sender.to(null);
        assertThrows(IllegalStateException.class, sender::send);
    }

    @Test
    void testToEmpty() {
        HttpRequestSender sender = this.sender.to("");
        assertThrows(LpAppsException.class, sender::send);
    }

    @Test
    void testToGoogle() throws LpAppsException {
        sender.to(GOOGLE_URL).send(); // implicit assert that this call does not throw
    }

    @Test
    void testToFake() throws LpAppsException {
        sender.to(FAKE_URL).send();
    }

    @Test
    void testUrlWithNoParameters() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .send();
        String urlWithParameters = fakeFactory.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL, urlWithParameters);
    }

    @Test
    void testUrlWithOneParameter() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .parameter("param", "value")
                .send();
        String urlWithParameters = fakeFactory.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param=value", urlWithParameters);
    }

    @Test
    void testUrlWithTwoParameters() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .send();
        String urlWithParameters = fakeFactory.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value1&param2=value2", urlWithParameters);
    }

    @Test
    void testUrlWithManyParameters() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5")
                .send();
        String urlWithParameters = fakeFactory.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

    @Test
    void testUrlAfterResettingParameters() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .parameter("param1", "value1")
                .parameter("param2", "value2")
                .parameter("param3", "value3")
                .parameter("param4", "value4")
                .parameter("param5", "value5")

                .parameter("param1", "value6")
                .send();

        String urlWithParameters = fakeFactory.getLastConnection().getURL().toString();
        assertEquals(FAKE_URL + "?param1=value6&param2=value2&param3=value3&param4=value4&param5=value5", urlWithParameters);
    }

    @Test
    void testNoMethodSet() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .send();

        String methodName = fakeFactory.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.GET.name(), methodName);
    }

    @Test
    void testGetMethodSet() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .method(HttpRequestSender.HttpMethod.GET)
                .send();

        String methodName = fakeFactory.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.GET.name(), methodName);
    }

    @Test
    void testPostMethodSet() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .method(HttpRequestSender.HttpMethod.POST)
                .send();

        String methodName = fakeFactory.getLastConnection().getRequestMethod();
        assertEquals(HttpRequestSender.HttpMethod.POST.name(), methodName);
    }

    @Test
    void testNoRequestBody() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .send();

        String actualBody = fakeFactory.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals("", actualBody);
    }

    @Test
    void testNullRequestBody() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .requestBody(null)
                .send();

        String actualBody = fakeFactory.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals("", actualBody);
    }

    @Test
    void testEmptyRequestBody() throws LpAppsException {
        String expectedBody = "";

        sender
                .to(FAKE_URL)
                .requestBody(expectedBody)
                .send();

        String actualBody = fakeFactory.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals(expectedBody, actualBody);
    }

    @Test
    void testASCIIRequestBody() throws LpAppsException {
        String expectedBody = "This is a request body with only ASCII characters.";

        sender
                .to(FAKE_URL)
                .requestBody(expectedBody)
                .send();

        String actualBody = fakeFactory.getLastConnection().getOutputStream().toString(Application.DEFAULT_CHARSET);
        assertEquals(expectedBody, actualBody);
    }

    @Test
    void testNoContentType() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .send();

        String actualContentType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertNull(actualContentType);
    }

    @Test
    void testNullContentType() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .contentType(null)
                .send();

        String actualContentType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertNull(actualContentType);
    }

    @Test
    void testEmptyContentType() throws LpAppsException {
        String expectedContentType = "";
        sender
                .to(FAKE_URL)
                .contentType(expectedContentType)
                .send();

        String actualContentType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertEquals(expectedContentType, actualContentType);
    }

    @Test
    void testContentType() throws LpAppsException {
        String expectedContentType = "text/plain";
        sender
                .to(FAKE_URL)
                .contentType(expectedContentType)
                .send();

        String actualContentType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_CONTENT_TYPE);
        assertEquals(expectedContentType, actualContentType);
    }

    @Test
    void testNoAcceptType() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .send();

        String actualAcceptType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertNull(actualAcceptType);
    }

    @Test
    void testNullAcceptType() throws LpAppsException {
        sender
                .to(FAKE_URL)
                .acceptType(null)
                .send();

        String actualAcceptType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertNull(actualAcceptType);
    }

    @Test
    void testEmptyAcceptType() throws LpAppsException {
        String expectedAcceptType = "";
        sender
                .to(FAKE_URL)
                .acceptType(expectedAcceptType)
                .send();

        String actualAcceptType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertEquals(expectedAcceptType, actualAcceptType);
    }

    @Test
    void testAcceptType() throws LpAppsException {
        String expectedAcceptType = "text/plain";
        sender
                .to(FAKE_URL)
                .acceptType(expectedAcceptType)
                .send();

        String actualAcceptType = fakeFactory.getLastConnection().getRequestProperty(REQUEST_PROPERTY_ACCEPT);
        assertEquals(expectedAcceptType, actualAcceptType);
    }

}

