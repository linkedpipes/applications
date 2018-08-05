package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DiscoveryController {

    @RequestMapping("/pipelines/discover")
    public String startDiscovery(){
        return "called /pipelines/discover";
    }

    @RequestMapping("/discovery/status")
    public String getDiscoveryStatus(){
        return "called /discovery/status";
    }

    @RequestMapping("/discovery/pipelineGroups")
    public String getPipelineGroups(){
        return "called /discovery/pipelineGroups";
    }

}