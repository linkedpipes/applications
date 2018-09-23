package com.linkedpipes.lpa.backend.util;

import java.io.IOException;
import java.io.InputStream;

public class StreamUtils {

    /**
     * Extracts all bytes from {@code stream}, decodes them using the {@link java.nio.charset.Charset#defaultCharset()
     * default charset}, then returns the resulting characters as a {@link String}. {@code stream} will be {@link
     * InputStream#close() closed} when the method returns.
     *
     * @param stream the stream containing the bytes to be extracted
     * @return a string containing the characters from the stream
     * @throws IOException if an I/O error occurs
     */
    public static String getStringFromStream(InputStream stream) throws IOException {
        return new String(stream.readAllBytes());
    }

}
