package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.DataSourceList;
import org.springframework.web.bind.annotation.*;

@RestController
public class DiscoveryController {

    @RequestMapping("/pipelines/discover")
    public Integer startDiscovery(@RequestBody DataSourceList dataSourceList){
        Integer testPipelineId = 1;
        return testPipelineId;
    }

    @RequestMapping("/discovery/status")
    public String getDiscoveryStatus(@RequestParam( value="discoveryId") Integer discoveryId){
        return "Running";
    }

    @RequestMapping("/discovery/pipelineGroups")
    @ResponseBody
    public String getPipelineGroups(@RequestParam( value="discoveryId") Integer discoveryId){
        return "called /discovery/pipelineGroups";
    }

}