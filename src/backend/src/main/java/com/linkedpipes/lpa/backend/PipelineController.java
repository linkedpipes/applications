package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.Pipeline;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PipelineController {

    @RequestMapping("/pipeline")
    @ResponseBody
    public Pipeline getPipeline(@RequestParam( value="pipelineUri") String pipelineUri){
        Pipeline testPipeline = new Pipeline();
        testPipeline.Uri = "https://discovery.linkedpipes.com/resource/pipeline/1";
        return testPipeline;
    }

    @RequestMapping("/pipeline/execute")
    public Integer executePipeline(@RequestParam( value="pipelineUri") String pipelineUri){
        Integer testExecutionId = 1;
        return testExecutionId;
    }

}