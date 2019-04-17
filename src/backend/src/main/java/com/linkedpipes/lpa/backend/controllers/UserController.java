package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.entities.Discovery;
import com.linkedpipes.lpa.backend.entities.profile.*;
import com.linkedpipes.lpa.backend.exceptions.LpAppsException;
import com.linkedpipes.lpa.backend.exceptions.UserNotFoundException;
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
    @PostMapping("/api/user")
    public ResponseEntity<UserProfile> getUser(@NotNull @RequestParam(value="webId", required=true) String user)
                    throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.addUserIfNotPresent(user));
        } catch(org.springframework.dao.CannotAcquireLockException | org.hibernate.exception.LockAcquisitionException e) {
            logger.warn("Error storing user, will retry once");
            return ResponseEntity.ok(userService.addUserIfNotPresent(user));
        }
    }

    @NotNull
    @PostMapping("/api/user/application")
    public void addApplication(@NotNull @RequestParam(value="webId", required=true) String user,
                                                      @NotNull @RequestParam(value="solidIri", required=true) String solidIri)
                      throws LpAppsException {
        try {
            userService.addUserIfNotPresent(user);
            userService.addApplication(user, solidIri);
        } catch(UserNotFoundException e) {
          logger.error("User not found: " + user);
          throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }
}
