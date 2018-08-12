package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSourceList;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.io.OutputStream;

@RestController
public class DiscoveryController {

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testDiscoveryId = 1;
        return testDiscoveryId;
    }

    @RequestMapping("/pipelines/discoverFromInput")
    public String startDiscovery(@RequestBody String discoveryConfig){
        if(discoveryConfig == null || discoveryConfig.isEmpty()) {
            return "Discovery config not provided";
        }

        try {

            URL url = new URL("http://demo.visualization.linkedpipes.com:8080/discovery/startFromInput");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(discoveryConfig.getBytes("UTF-8"));
            os.close();

            conn.connect();

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed: HTTP error code: "
                        + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            //System.out.println("Output from Server .... \n");
            while ((output = br.readLine()) != null) {
                //System.out.println(output);
                sb.append(output);
                sb.append("\n");
            }

            br.close();
            conn.disconnect();
            return sb.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "Error";
    }

    @RequestMapping("/discovery/status")
    public String getDiscoveryStatus(@RequestParam( value="discoveryId") String discoveryId){
        try {
            URL url = new URL("http://demo.visualization.linkedpipes.com:8080/discovery/" + discoveryId);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            conn.connect();

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed: HTTP error code: "
                        + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            //System.out.println("Output from Server .... \n");
            while ((output = br.readLine()) != null) {
                //System.out.println(output);
                sb.append(output);
                sb.append("\n");
            }

            br.close();

            conn.disconnect();
            return sb.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error";
    }

    @RequestMapping("/discovery/pipelineGroups")
    @ResponseBody
    public String getPipelineGroups(@RequestParam( value="discoveryId") String discoveryId){
        try {
            URL url = new URL("http://demo.visualization.linkedpipes.com:8080/discovery/" + discoveryId + "/pipelines");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            conn.connect();

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("Failed: HTTP error code: "
                        + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            //System.out.println("Output from Server .... \n");
            while ((output = br.readLine()) != null) {
                //System.out.println(output);
                sb.append(output);
                sb.append("\n");
            }

            br.close();

            conn.disconnect();
            return sb.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "called /discovery/pipelineGroups";
    }

}