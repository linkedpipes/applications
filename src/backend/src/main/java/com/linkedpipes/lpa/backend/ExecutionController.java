package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExecutionController {

    @RequestMapping("/execution/status")
    public String getStatus(){
        return "called /execution/status";
    }

    @RequestMapping("/execution/result")
    public String getResult(){
        return "called /execution/result";
    }

}