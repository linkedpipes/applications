package com.linkedpipes.lpa.backend.util;

import org.junit.jupiter.api.Test;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static org.junit.Assert.assertEquals;

class UrlUtilsTests {

    @Test
    void testUrlFromNothing() {
        assertEquals("", UrlUtils.urlFrom());
    }

    @Test
    void testUrlFromStringNull() {
        assertEquals("", UrlUtils.urlFrom((String) null));
    }

    @Test
    void testUrlFromArrayNull() {
        assertThrowsExactly(NullPointerException.class, () -> UrlUtils.urlFrom((String[]) null));
    }

    @Test
    void testUrlFromStrings() {
        String expectedString = "Hello/from/the/other/side";

        assertEquals(expectedString, UrlUtils.urlFrom("Hello", "from", "the", "other", "side"));
    }

    @Test
    void testUrlFromIgnoreEmptyStrings() {
        String expectedString = "http://www.example.com/example/subexample";

        assertEquals(expectedString, UrlUtils.urlFrom("http://www.example.com", "", "example", "", "", "subexample", ""));
    }

    @Test
    void testUrlFromIgnoreSlashes() {
        String expectedString = "http://www.example.com/example/subexample";

        assertEquals(expectedString, UrlUtils.urlFrom("http://www.example.com", "//", "example", "//////////", "//", "subexample", "/"));
    }

}
