package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.Execution;
import com.linkedpipes.lpa.backend.entities.UserProfile;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import com.linkedpipes.lpa.backend.services.UserService;
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

    @PutMapping("/api/user/discovery")
    public void setUserDiscovery(@RequestParam(value="userId", required=true) String user,
                                 @RequestParam(value="discoveryId", required=true) String discovery)
                              throws LpAppsException {
        try {
            logger.info("Set user discovery:: user = " + user + ", discoveryId = " + discovery);
            userService.setUserDiscovery(user, discovery);
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @PostMapping("/api/user/discovery")
    public ResponseEntity<List<Discovery>> getUserDiscoveries(@RequestParam(value="userId", required=true) String user)
                            throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.getUserDiscoveries(user));
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @DeleteMapping("/api/user/discovery")
    public void deleteUserDiscovery(@RequestParam(value="userId", required=true) String user,
                                    @RequestParam(value="discoveryId", required=true) String discovery)
                              throws LpAppsException {
        logger.info("Delete discovery:: user = '" + user + "', discovery = '" + discovery + "'");
        userService.deleteUserDiscovery(user, discovery);
    }

    @PutMapping("/api/user/execution")
    public void setUserExecution(@RequestParam(value="userId", required=true) String user,
                                 @RequestParam(value="executionIri", required=true) String execution)
                              throws LpAppsException {
        try {
            logger.info("Set user execution:: user = " + user + ", executionIri = " + execution);
            userService.setUserExecution(user, execution);
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @PostMapping("/api/user/execution")
    public ResponseEntity<List<Execution>> getUserExecutions(@RequestParam(value="userId", required=true) String user)
                            throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.getUserExecutions(user));
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @DeleteMapping("/api/user/execution")
    public void deleteUserExecution(@RequestParam(value="userId", required=true) String user,
                                    @RequestParam(value="executionIri", required=true) String execution)
                              throws LpAppsException {
        logger.info("Delete execution:: user = '" + user + "', execution = '" + execution + "'");
        userService.deleteUserExecution(user, execution);
    }

    @PostMapping("/api/user")
    public ResponseEntity<UserProfile> addUser(@RequestParam(value="userId", required=true) String user,
                        @RequestParam(value="webId", required=false) String webId)
                    throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.addUser(user, webId));
        } catch (UserTakenException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Username already taken", e);
        }
    }

    @PutMapping("/api/user")
    public ResponseEntity<UserProfile> updateUser(@RequestParam(value="userId", required=true) String user,
                        @RequestParam(value="webId", required=false) String webId)
                    throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.updateUser(user, webId));
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    @GetMapping("/api/user")
    public ResponseEntity<UserProfile> getUser(@RequestParam(value="userId", required=true) String user)
                    throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.getUserProfile(user));
        } catch(UserNotFoundException e) {
            logger.error("User not found: " + user);
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }
}
