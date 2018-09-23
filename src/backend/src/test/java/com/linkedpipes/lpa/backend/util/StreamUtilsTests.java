package com.linkedpipes.lpa.backend.util;

import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import static com.linkedpipes.lpa.backend.util.StreamUtils.getStringFromStream;
import static org.junit.Assert.assertEquals;

public class StreamUtilsTests {

    private static final InputStream EMPTY_STREAM = new InputStream() {
        @Override
        public int read() {
            return -1;
        }
    };
    private static final String LONG_TEXT = "Sed viverra nec sapien eu volutpat. Quisque convallis lobortis arcu, ac " +
            "luctus quam pharetra in. Quisque finibus lectus leo, ac vehicula odio hendrerit id. Suspendisse pharetra " +
            "diam ut ipsum molestie viverra. Donec eget nulla vehicula, luctus lacus at, lobortis diam. Interdum et " +
            "malesuada fames ac ante ipsum primis in faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et " +
            "ultrices posuere cubilia Curae; Sed a diam sed lacus volutpat fermentum. Vestibulum lectus lectus, pretium " +
            "quis pellentesque vitae, congue non neque. Morbi vel tempus diam. Nulla aliquam a neque at sollicitudin. " +
            "Curabitur fermentum velit nec tortor mollis sollicitudin. Nulla facilisi. Sed justo orci, mattis vel bibendum " +
            "id, iaculis scelerisque purus. Aliquam tempus urna et dignissim dictum. Integer vitae sem nec orci luctus consectetur.";
    private static final String UNICODE_TEXT = "𐌼𐌰𐌲 𐌲𐌻𐌴𐍃 𐌹̈𐍄𐌰𐌽, 𐌽𐌹 𐌼𐌹𐍃 𐍅𐌿 𐌽𐌳𐌰𐌽 𐌱𐍂𐌹𐌲𐌲𐌹𐌸";

    @Test
    public void getStringFromEmptyStreamTest() throws IOException {
        assertEquals("", getStringFromStream(EMPTY_STREAM));
    }

    @Test
    public void getStringFromByteArrayStreamTest() throws IOException {
        InputStream stream = new ByteArrayInputStream(new byte[]{'H', 'e', 'l', 'l', 'o', '!'});
        assertEquals("Hello!", getStringFromStream(stream));
    }

    @Test
    public void getStringFromLongTextStreamTest() throws IOException {
        InputStream stream = new ByteArrayInputStream(LONG_TEXT.getBytes());
        assertEquals(LONG_TEXT, getStringFromStream(stream));
    }

    @Test
    public void getStringFromUnicodeTextStreamTest() throws IOException {
        InputStream stream = new ByteArrayInputStream(UNICODE_TEXT.getBytes());
        assertEquals(UNICODE_TEXT, getStringFromStream(stream));
    }

}
