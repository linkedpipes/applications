package com.linkedpipes.lpa.backend;

import com.linkedpipes.lpa.backend.entities.DataSource;
import com.linkedpipes.lpa.backend.entities.DataSourceList;
import org.springframework.web.bind.annotation.*;

@RestController
public class DataSourceController {

    @RequestMapping("/datasources")
    @ResponseBody
    public DataSourceList getDataSources(){
        return new DataSourceList();
    }

    @PostMapping("/datasources")
    public String createDataSources(@RequestParam( value="fileUri") String fileUri){
        return "called POST /datasources";
    }

    @RequestMapping("/datasource")
    public DataSource getDataSource(@RequestParam( value="dataSourceUri") String dataSourceUri){
        DataSource dataSource = new DataSource();
        return dataSource;
    }
    
}
