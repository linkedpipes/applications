package com.linkedpipes.lpa.backend.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;

@Component
public class ShutdownManager {

    @Autowired
    private ApplicationContext appContext;

    public void shutdown(int returnCode){
        SpringApplication.exit(appContext, () -> returnCode);
    }
}
