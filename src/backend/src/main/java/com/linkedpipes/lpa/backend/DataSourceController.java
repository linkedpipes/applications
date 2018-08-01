package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataSourceController {

    @RequestMapping("/datasource")
    public String getDataSources(){
        return "called /datasources";
    }
    
}
