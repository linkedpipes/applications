package com.linkedpipes.lpa.backend.util;

import org.junit.Test;

import static com.linkedpipes.lpa.backend.testutil.TestUtils.assertThrowsExactly;
import static com.linkedpipes.lpa.backend.testutil.TestUtils.invokeStatic;
import static org.junit.Assert.assertEquals;

public class UrlUtilsTests {

    private static final String STRIP_LEADING_SLASHES = "stripLeadingSlashes";
    private static final String STRIP_TRAILING_SLASHES = "stripTrailingSlashes";
    private static final String STRIP_SLASHES = "stripSlashes";
    private static final Class[] PARAMETER_TYPES_STRING = new Class[]{String.class};

    ///// stripLeadingSlashes /////

    @Test
    public void testStripLeadingSlashesNull() {
        String inputString = null;
        String expectedString = null;

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesEmpty() {
        String inputString = "";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesSingleSlash() {
        String inputString = "/";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesManySlashes() {
        String inputString = "////////////////";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesSingleLetter() {
        String inputString = "/g/";
        String expectedString = "g/";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesBackslash() {
        String inputString = "///\\////\\//";
        String expectedString = "\\////\\//";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesWhitespaceBeforeSlashes() {
        String inputString = "       //////Hello there";
        String expectedString = "       //////Hello there";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripLeadingSlashesPath() {
        String inputString = "/usr/local/bin/";
        String expectedString = "usr/local/bin/";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_LEADING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    ///// stripTrailingSlashes /////

    @Test
    public void testStripTrailingSlashesNull() {
        String inputString = null;
        String expectedString = null;

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesEmpty() {
        String inputString = "";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesSingleSlash() {
        String inputString = "/";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesManySlashes() {
        String inputString = "////////////////";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesSingleLetter() {
        String inputString = "/g/";
        String expectedString = "/g";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesBackslash() {
        String inputString = "///\\////\\///";
        String expectedString = "///\\////\\";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesWhitespaceAfterSlashes() {
        String inputString = "Hello there/////     ";
        String expectedString = "Hello there/////     ";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripTrailingSlashesPath() {
        String inputString = "/usr/local/bin/";
        String expectedString = "/usr/local/bin";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_TRAILING_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    ///// stripSlashes /////

    @Test
    public void testStripSlashesNull() {
        String inputString = null;
        String expectedString = null;

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesEmpty() {
        String inputString = "";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesSingleSlash() {
        String inputString = "/";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesManySlashes() {
        String inputString = "////////////////";
        String expectedString = "";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesSingleLetter() {
        String inputString = "/g/";
        String expectedString = "g";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesBackslash() {
        String inputString = "///\\////\\///";
        String expectedString = "\\////\\";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesWhitespaceBeforeSlashes() {
        String inputString = "       //////Hello there/////     ";
        String expectedString = "       //////Hello there/////     ";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testStripSlashesPath() {
        String inputString = "/usr/local/bin/";
        String expectedString = "usr/local/bin";

        assertEquals(expectedString, invokeStatic(UrlUtils.class, STRIP_SLASHES, PARAMETER_TYPES_STRING, inputString));
    }

    @Test
    public void testUrlFromFirstStringNull() {
        assertThrowsExactly(NullPointerException.class, () -> UrlUtils.urlFrom(null));
    }

    @Test
    public void testUrlFromAnotherStringNull() {
        assertThrowsExactly(NullPointerException.class, () -> UrlUtils.urlFrom("HelloThere", (String) null));
    }

    @Test
    public void testUrlFromMoreStringsNull() {
        assertThrowsExactly(NullPointerException.class, () -> UrlUtils.urlFrom("HelloThere", (String[]) null));
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
