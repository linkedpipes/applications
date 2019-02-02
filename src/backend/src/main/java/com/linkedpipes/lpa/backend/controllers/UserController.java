package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
import com.linkedpipes.lpa.backend.exceptions.UserTakenException;
import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.services.UserService;

import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
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

    @PostMapping("/api/user")
    public void addUser(@RequestParam(value="userId", required=true) String user,
                        @RequestParam(value="fullName", required=false) String name)
                    throws LpAppsException {
        try {
            userService.addUser(user, name);
        } catch (UserTakenException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "Username already taken", e);
        }
    }
}
