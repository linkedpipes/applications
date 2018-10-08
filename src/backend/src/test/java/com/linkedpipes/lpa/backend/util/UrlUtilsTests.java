package com.linkedpipes.lpa.backend.util;

import org.junit.Test;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static org.junit.Assert.assertEquals;

public class UrlUtilsTests {

    @Test
    public void testUrlFromNothing() {
        assertEquals("", UrlUtils.urlFrom());
    }

    @Test
    public void testUrlFromStringNull() {
        assertEquals("", UrlUtils.urlFrom((String) null));
    }

    @Test
    public void testUrlFromArrayNull() {
        assertThrowsExactly(NullPointerException.class, () -> UrlUtils.urlFrom((String[]) null));
    }

    @Test
    public void testUrlFromStrings() {
        String expectedString = "Hello/from/the/other/side";

        assertEquals(expectedString, UrlUtils.urlFrom("Hello", "from", "the", "other", "side"));
    }

    @Test
    public void testUrlFromIgnoreEmptyStrings() {
        String expectedString = "http://www.example.com/example/subexample";

        assertEquals(expectedString, UrlUtils.urlFrom("http://www.example.com", "", "example", "", "", "subexample", ""));
    }

    @Test
    public void testUrlFromIgnoreSlashes() {
        String expectedString = "http://www.example.com/example/subexample";

        assertEquals(expectedString, UrlUtils.urlFrom("http://www.example.com", "//", "example", "//////////", "//", "subexample", "/"));
    }

}
