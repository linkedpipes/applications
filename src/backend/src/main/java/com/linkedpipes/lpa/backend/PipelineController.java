package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.Pipeline;
import com.linkedpipes.lpa.backend.helpers.StreamHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class PipelineController {

    private static final Logger logger =
            LoggerFactory.getLogger(DiscoveryController.class);

    @RequestMapping("/pipeline")
    @ResponseBody
    public Pipeline getPipeline(@RequestParam( value="pipelineUri") String pipelineUri){
        Pipeline testPipeline = new Pipeline();
        testPipeline.Uri = "https://discovery.linkedpipes.com/resource/pipeline/1";
        return testPipeline;
    }

    @RequestMapping("/pipeline/export")
    @ResponseBody
    public String exportPipeline(@RequestParam( value="discoveryId") String discoveryId, @RequestParam( value="pipelineUri") String pipelineUri){
        try {
            URL url = new URL(Application.config.getProperty("discoveryServiceUrl") + "/discovery/" + discoveryId + "/export/" + pipelineUri);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Content-Type", "text/plain");
            conn.setDoOutput(true);

            if (conn.getResponseCode() != 200) {
                String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                        + StreamHelper.getStringFromStream(conn.getErrorStream());
                logger.error(errorMsg);
                return errorMsg;
            }

            String response = StreamHelper.getStringFromStream(conn.getInputStream());
            conn.disconnect();
            return response;

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "An error occurred";
    }

    @RequestMapping("/pipeline/create")
    @ResponseBody
    public void createPipeline(@RequestParam( value="discoveryId") String discoveryId, @RequestParam( value="pipelineUri") String pipelineUri){

    }

    @RequestMapping("/pipeline/execute")
    public String executePipeline(@RequestParam( value="etlPipelineIri") String etlPipelineIri){
        try {
            String urlStr = Application.config.getProperty("etlServiceUrl") + "/executions";
            urlStr += "?pipeline=" + etlPipelineIri;
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            if (conn.getResponseCode() != 200) {
                String errorMsg = conn.getResponseCode() + " " + conn.getResponseMessage() + ": "
                        + StreamHelper.getStringFromStream(conn.getErrorStream());
                logger.error(errorMsg);
                return errorMsg;
            }

            String response = StreamHelper.getStringFromStream(conn.getInputStream());
            conn.disconnect();
            return response;

        } catch (IOException e) {
            logger.error("Exception: ", e);
        }

        return "An error occurred";
    }

}