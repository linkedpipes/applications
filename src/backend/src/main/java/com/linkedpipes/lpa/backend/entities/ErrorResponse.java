package com.linkedpipes.lpa.backend.entities;

public class ErrorResponse {

    public String errorMessage;
    public int errorCode;

    public ErrorResponse(int errorCode, String errorMessage){

        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }

}
