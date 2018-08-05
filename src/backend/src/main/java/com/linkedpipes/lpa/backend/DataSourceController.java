package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataSourceController {

    @RequestMapping("/datasources")
    public String getDataSources(){
        return "called GET /datasources";
    }

    @RequestMapping("/datasources")
    public String createDataSources(){
        return "called POST /datasources";
    }

    @RequestMapping("/datasource")
    public String getDataSource(){
        return "called /datasource";
    }
    
}
