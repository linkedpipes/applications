package com.linkedpipes.lpa.backend.exceptions;

import java.io.IOException;

public class UserNotFoundException extends IOException {

    public UserNotFoundException(String username) {
        super(username);
    }
}
