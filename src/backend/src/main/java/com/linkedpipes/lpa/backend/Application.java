package com.linkedpipes.lpa.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
public class Application {

	private static final Logger logger =
			LoggerFactory.getLogger(Application.class);

	private static final String CONFIG_FILE_NAME = "config.properties";

	public static final Properties config;

	static {
		File configFile = new File(CONFIG_FILE_NAME);
		config = new Properties();

		try {
			FileReader reader = new FileReader(configFile);
			config.load(reader);

			reader.close();
		} catch (IOException ex) {
			logger.error("Exception: ", ex);
		}
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("http://localhost:9000");
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		logger.info("Application started");
	}
}
