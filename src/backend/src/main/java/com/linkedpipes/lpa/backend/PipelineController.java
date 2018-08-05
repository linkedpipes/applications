package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PipelineController {

    @RequestMapping("/pipeline")
    public String getPipeline(){
        return "called /pipeline";
    }

    @RequestMapping("/pipeline/execute")
    public String executePipeline(){
        return "called /pipeline/execute";
    }

}