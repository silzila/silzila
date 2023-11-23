package com.silzila.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.EXPECTATION_FAILED)
public class ExpectationFailedException extends Exception {

    public ExpectationFailedException(String message) {
        super(message);
    }

    public ExpectationFailedException(String message, Throwable t) {
        super(message, t);
    }
}
