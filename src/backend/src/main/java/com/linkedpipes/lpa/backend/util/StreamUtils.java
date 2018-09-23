package com.linkedpipes.lpa.backend.util;

import java.io.*;

public class StreamUtils {

    private static final int BUFFER_SIZE = 10000;

    //TODO Ivan - fix null array exception in below commented code
    /*
     * Closes the stream
     */
    public static String getStringFromStream(InputStream stream) throws IOException {
        StringBuilder sb;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(stream))) {
            String output;
            sb = new StringBuilder();
            while ((output = br.readLine()) != null) {
                sb.append(output);
                sb.append("\n");
            }

            return  sb.toString();

        /*ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        copyStreamsAndClose(stream, outputStream);
        return outputStream.toString();*/
        }
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
