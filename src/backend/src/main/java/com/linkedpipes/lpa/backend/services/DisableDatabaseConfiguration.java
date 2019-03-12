package com.linkedpipes.lpa.backend.services;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@EnableAutoConfiguration(exclude = DataSourceAutoConfiguration.class)
@Profile("disableDB")
public class DisableDatabaseConfiguration {
}
