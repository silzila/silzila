package com.silzila.helper;

import com.silzila.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class UtilityService {
    public void validateNonEmptyString(String string) throws BadRequestException {
        if(string == null || string.trim().isEmpty()){
            throw new BadRequestException("Value should not be null or empty string");
        }
    }
}
