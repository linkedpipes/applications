package com.linkedpipes.lpa.backend.controllers;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.entities.profile.UserProfile;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("!disableDB")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(ApplicationContext context) {
        this.userService = context.getBean(UserService.class);
    }


    /**
     * Get user profile. If user doesn't exist, it will be added automatically.
     *
     * @param user user identifier - currently webId is sent from frontend.
     * @return user profile in JSON
     */
    @NotNull
    @PostMapping("/api/user")
    public ResponseEntity<UserProfile> getUser(@NotNull @RequestParam(value = "webId", required = true) String user) {
        try {
            return ResponseEntity.ok(userService.addUserIfNotPresent(user));
        } catch(org.springframework.dao.CannotAcquireLockException | org.hibernate.exception.LockAcquisitionException e) {
            logger.warn("Error storing user, will retry once");
            return ResponseEntity.ok(userService.addUserIfNotPresent(user));
        }
    }

    /**
     * Delete execution from user profile in DB. If user is not found, 404 is
     * returned.
     *
     * @param user user identifier - currently webId is sent from frontend
     * @param executionIri IRI of execution to be deleted
     * @return user profile in JSON after deletion
     * @throws LpAppsException HTTP 404 when user is not found
     */
    @NotNull
    @DeleteMapping("/api/user/execution")
    public ResponseEntity<UserProfile> deleteExecution(
        @NotNull @RequestParam(value = "webId", required = true) String user,
        @NotNull @RequestParam(value = "executionIri", required = true) String executionIri)
        throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.deleteExecution(user, executionIri));
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    /**
     * Delete discovery from user profile in DB. If user is not found, 404 is
     * returned.
     *
     * @param user user identifier - currently webId is sent from frontend
     * @param discoveryId ID of discovery to be deleted
     * @return user profile in JSON after deletion
     * @throws LpAppsException HTTP 404 when user is not found
     */
    @NotNull
    @DeleteMapping("/api/user/discovery")
    public ResponseEntity<UserProfile> deleteDiscovery(
        @NotNull @RequestParam(value = "webId", required = true) String user,
        @NotNull @RequestParam(value = "discoveryId", required = true) String discoveryId)
        throws LpAppsException {
        try {
            return ResponseEntity.ok(userService.deleteDiscovery(user, discoveryId));
        } catch (UserNotFoundException e) {
            throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

    /**
     * Set color scheme on user profile. If user doesn't exist, it will be added
     * automatically. On successful change, new color is annnounced via sockets.
     *
     * Sockets:: room: [webId], event: colorChanged, message: color as string.
     *
     * @param user user identifier - currently webId is sent from frontend
     * @param color new color (arbitrary string up to 255 characters)
     * @return user profile in JSON after new color is set
     * @throws LpAppsException HTTP 404 when user is not found (should not happen)
     */
    @NotNull
    @PostMapping("/api/user/color")
    public ResponseEntity<UserProfile> setColorScheme(
        @NotNull @RequestParam(value="webId", required=true) String user,
        @NotNull @RequestParam(value="color", required=true) String color
    ) throws LpAppsException {
        try {
            userService.addUserIfNotPresent(user);
            UserProfile p = userService.setUserColorScheme(user, color);
            Application.SOCKET_IO_SERVER.getRoomOperations(user).sendEvent("colorChanged", color);
            return ResponseEntity.ok(p);
        } catch(UserNotFoundException e) {
          logger.error("User not found: " + user);
          throw new LpAppsException(HttpStatus.BAD_REQUEST, "User not found", e);
        }
    }

}
