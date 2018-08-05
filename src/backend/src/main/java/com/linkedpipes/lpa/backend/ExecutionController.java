package com.linkedpipes.lpa.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExecutionController {

    @RequestMapping("/execution/status")
    public String getStatus(@RequestParam( value="executionId") Integer executionId){
        return "Finished";
    }

    @RequestMapping("/execution/result")
    @ResponseBody
    public String getResult(@RequestParam( value="executionId") Integer executionId){
        return "called /execution/result";
    }

}