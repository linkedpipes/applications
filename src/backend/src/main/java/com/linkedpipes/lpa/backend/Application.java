package com.linkedpipes.lpa.backend;

import com.corundumstudio.socketio.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.typesafe.config.Config;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.Charset;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import static com.typesafe.config.ConfigFactory.*;

/**
 * Backend entrypoint. SpringBoot and SocketIO server are initialized here, as
 * well as the application scheduler for backend-side polling.
 */
@SpringBootApplication
public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);
    public static final Charset DEFAULT_CHARSET = Charset.defaultCharset();
    /**
     * Application-wide Socket.io server.
     */
    public static final SocketIOServer SOCKET_IO_SERVER = getSocketIoServer();

    /**
     * Application-wide scheduler for backend-side polling.
     */
    public static final ScheduledExecutorService SCHEDULER = Executors.newScheduledThreadPool(1);

    /**
     * CORS configuration.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedHeaders("Content-Type",
                        "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Authorization",
                        "X-Requested-With", "requestId", "Correlation-Id")
                        .allowedMethods("PUT", "POST", "DELETE", "GET")
                        .allowedOrigins(getConfig().getStringList("lpa.allowedOrigins").toArray(new String[0]));
            }
        };
    }

    /*@Bean
    public ServletContextInitializer sentryServletContextInitializer() {
        return new io.sentry.spring.SentryServletContextInitializer();
    }*/

    /**
     * Sentry exception handler.
     */
    /*@Bean
    public HandlerExceptionResolver sentryExceptionResolver() {
        return new io.sentry.spring.SentryExceptionResolver() {
            @Override
            public ModelAndView resolveException(HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 Object handler,
                                                 Exception ex) {

                    if (ex instanceof LpAppsException && ((LpAppsException) ex).getErrorStatus().is4xxClientError())
                        return null;

                    super.resolveException(request, response, handler, ex);

                return null;
            }

        };
    }*/

    /**
     * Socket.io server factory.
     * @return Socket.io server
     */
    @NotNull
    private static SocketIOServer getSocketIoServer() {
        Configuration config = new Configuration();
        config.setPort(9092);
        config.setRandomSession(true);  //default is false
        SocketConfig socketConfig = new SocketConfig();
        socketConfig.setReuseAddress(true);
        config.setSocketConfig(socketConfig);
        logger.info("Called getSocketIOServer");

        SocketIOServer server = new SocketIOServer(config);

        server.addEventListener("join", String.class, (SocketIOClient socketIOClient, String roomName, AckRequest ackRequest) -> {
                logger.info("Client " + socketIOClient.getSessionId() + " joined room: " + roomName);
                socketIOClient.joinRoom(roomName);
            });

        server.addEventListener("leave", String.class, (SocketIOClient socketIOClient, String roomName, AckRequest ackRequest) -> {
                logger.info("Client " + socketIOClient.getSessionId() + " left room: " + roomName);
                socketIOClient.leaveRoom(roomName);
            });

        return server;
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
