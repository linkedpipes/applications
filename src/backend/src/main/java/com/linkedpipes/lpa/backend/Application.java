package com.linkedpipes.lpa.backend;

import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.corundumstudio.socketio.listener.*;
import com.corundumstudio.socketio.*;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;

import java.nio.charset.Charset;

import static com.typesafe.config.ConfigFactory.*;

@SpringBootApplication
public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    public static final Charset DEFAULT_CHARSET = Charset.defaultCharset();
    public static final SocketIOServer SOCKET_IO_SERVER = getSocketIoServer();
    public static final ScheduledExecutorService SCHEDULER = Executors.newScheduledThreadPool(1);

    @Bean
    @SuppressWarnings("unused")
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins(getConfig().getString("lpa.allowedOrigins"));
            }
        };
    }

    public static SocketIOServer getSocketIoServer() {
        Configuration config = new Configuration();
        config.setPort(9092);
        SocketConfig socketConfig = new SocketConfig();
        socketConfig.setReuseAddress(true);
        config.setSocketConfig(socketConfig);
        logger.info("Called getSocketIOServer");

        return new SocketIOServer(config);
    }

    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);

        SOCKET_IO_SERVER.start();

        logger.info("Application started");
    }

    public static Config getConfig() {
        return ConfigLazyLoader.CONFIG;
    }

    private static class ConfigLazyLoader {

        private static final Config CONFIG = defaultOverrides()
                .withFallback(defaultApplication())
                .withFallback(defaultReference());
    }

}
