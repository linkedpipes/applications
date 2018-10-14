package com.linkedpipes.lpa.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    public static final Charset DEFAULT_CHARSET = Charset.defaultCharset();

    @Bean
    @SuppressWarnings("unused")
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins(getConfig().getProperty("allowedOrigins"));
            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        logger.info("Application started");
    }

    public static Properties getConfig() {
        return ConfigLazyLoader.CONFIG;
    }

    private static class ConfigLazyLoader {

        private static final Properties CONFIG = loadConfig();

        private static Properties loadConfig() {
            Properties config = new Properties();
            try (InputStream stream = Application.class.getResourceAsStream("config.properties")) {
                config.load(new InputStreamReader(stream, Application.DEFAULT_CHARSET));
            } catch (IOException ex) {
                logger.error("Failed to load application configuration", ex);
            }
            return config;
        }

    }

}
