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
import java.nio.charset.Charset;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class Application {

	private static final Logger logger =
			LoggerFactory.getLogger(Application.class);

	private static final String CONFIG_FILE_NAME = "config.properties";

	public static final Properties config;

	static {
		File configFile = new File(CONFIG_FILE_NAME);
		config = new Properties();
		try (FileReader reader = new FileReader(configFile)) {
			config.load(reader);
		} catch (IOException ex) {
			logger.error("Exception: ", ex);
		}
	}

    public static final Charset DEFAULT_CHARSET = Charset.defaultCharset();

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") //
						.allowedOrigins("*") //
						.allowedMethods("OPTIONS", "HEAD", "GET", "PUT", "POST", "DELETE", "PATCH") //
						.allowedHeaders("*") //
						.exposedHeaders("WWW-Authenticate") //
						.allowCredentials(true)
						.maxAge(TimeUnit.DAYS.toSeconds(1));
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		logger.info("Application started");
	}
}
