package com.linkedpipes.lpa.backend.exceptions;

import java.io.IOException;

public class UserTakenException extends IOException {

    public UserTakenException(String username) {
        super(username);
    }
}
