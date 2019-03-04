package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import com.linkedpipes.lpa.backend.services.UserService;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Profile("!disableDB")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(ApplicationContext context) {
        this.userService = context.getBean(UserService.class);
    }

    @NotNull
    @PostMapping("/api/user/discovery")
    public ResponseEntity<List<Discovery>> getUserDiscoveries(@NotNull @RequestParam(value="webId", required=true) String user)
                            throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.getUserDiscoveries(user));
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @DeleteMapping("/api/user/discovery")
    public void deleteUserDiscovery(@NotNull @RequestParam(value="webId", required=true) String user,
                                    @NotNull @RequestParam(value="discoveryId", required=true) String discovery)
                              throws LpAppsException {
        logger.info("Delete discovery:: user = '" + user + "', discovery = '" + discovery + "'");
        userService.deleteUserDiscovery(user, discovery);
    }

    @DeleteMapping("/api/user/execution")
    public void deleteUserExecution(@NotNull @RequestParam(value="webId", required=true) String user,
                                    @NotNull @RequestParam(value="executionIri", required=true) String execution)
                              throws LpAppsException {
        logger.info("Delete execution:: user = '" + user + "', execution = '" + execution + "'");
        userService.deleteUserExecution(user, execution);
    }

    @NotNull
    @PostMapping("/api/user")
    public ResponseEntity<UserProfile> addUser(@NotNull @RequestParam(value="webId", required=true) String user) throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.addUser(user));
        } catch (UserTakenException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Username already taken", e);
        }
    }

    @NotNull
    @GetMapping("/api/user")
    public ResponseEntity<UserProfile> getUser(@NotNull @RequestParam(value="webId", required=true) String user)
                    throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.getUserProfile(user));
        } catch(UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    @PostMapping("/api/user/application")
    public ResponseEntity<UserProfile> addApplication(@NotNull @RequestParam(value="webId", required=true) String user,
                                                      @NotNull @RequestParam(value="solidIri", required=true) String solidIri)
                      throws LpAppsException {
        try {
          return ResponseEntity.ok(userService.addApplication(user, solidIri));
        } catch(UserNotFoundException e) {
          logger.error("User not found: " + user);
          throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @NotNull
    @DeleteMapping("/api/user/application")
    public ResponseEntity<UserProfile> deleteApplication(@NotNull @RequestParam(value="webId", required=true) String user,
                                                         @NotNull @RequestParam(value="solidIri", required=true) String solidIri)
                     throws LpAppsException {
        try {
          return ResponseEntity.ok(userService.deleteApplication(user, solidIri));
        } catch(UserNotFoundException e) {
          logger.error("User not found: " + user);
          throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }
}
