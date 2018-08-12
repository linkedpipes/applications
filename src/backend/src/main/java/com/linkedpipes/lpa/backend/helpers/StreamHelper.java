package com.linkedpipes.lpa.backend.helpers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class StreamHelper {

    public static String getStringFromStream(InputStream stream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(
                stream));
        String output;
        StringBuilder sb = new StringBuilder();
        while ((output = br.readLine()) != null) {
            sb.append(output);
            sb.append("\n");
        }

        br.close();
        return sb.toString();
    }

}
