package com.linkedpipes.lpa.backend.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class StreamUtils {

    private static final int BUFFER_SIZE = 10000;

    /*
     * Closes the stream
     */
    public static String getStringFromStream(InputStream stream) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        copyStreamsAndClose(stream, outputStream);
        return outputStream.toString();
    }

    public static void copyStreamsAndClose(InputStream inputStream, OutputStream outputStream) throws IOException {
        try (inputStream; outputStream) {
            copyStreams(inputStream, outputStream);
        }
    }

    /*
     * Does not close the streams
     */
    public static void copyStreams(InputStream inputStream, OutputStream outputStream) throws IOException {
        byte[] buffer = new byte[BUFFER_SIZE];
        int bytesRead;
        do {
            bytesRead = inputStream.read(buffer);
            outputStream.write(buffer, 0, bytesRead);
        } while (bytesRead != -1);
    }

}
