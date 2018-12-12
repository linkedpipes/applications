package com.linkedpipes.lpa.backend.exceptions;

import com.linkedpipes.lpa.backend.entities.ErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.WebUtils;

/**
 * Provides handling for exceptions throughout this service.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(LpAppsException.class)
    public final ResponseEntity<Object> handleLpAppsException(LpAppsException ex) {
        logger.error("Exception: ", ex);

        return new ResponseEntity<>(new ErrorResponse(ex.getErrorStatus().value(), ex.getMessage()), ex.getErrorStatus());
    }

    @Override
    public final ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String errorMsg = ex.getParameterName() + " parameter is missing";

        return handleExceptionInternal(ex, errorMsg, headers, status, request);
    }

    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, String errorMsg, HttpHeaders headers, HttpStatus status, WebRequest request) {
        if (HttpStatus.INTERNAL_SERVER_ERROR.equals(status)) {
            request.setAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE, ex, WebRequest.SCOPE_REQUEST);
        }

        return new ResponseEntity<>(new ErrorResponse(status.value(), errorMsg), headers, status);
    }
}