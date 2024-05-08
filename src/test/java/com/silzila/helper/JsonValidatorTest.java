package com.silzila.helper;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class JsonValidatorTest {
    @Test
    public void testProperFormat(){
        String jsonStr = "[{\"name\":\"karthik\"}]";
        boolean throwed = false;
        try {
            JsonValidator.validate(jsonStr);
        }catch(Exception e){
            throwed = true;
        }
        assertFalse(throwed);
    }
    @Test
    public void testWrongFormatKeyContainsArray(){
        String jsonStr = "[{\"name\":\"karthik\",\"array\":[\"a\",\"b\"]}]";
        boolean throwed = false;
        try {
            JsonValidator.validate(jsonStr);
        }catch(Exception e){
            throwed = true;
        }
        assertTrue(throwed);
    }
    @Test
    public void testWrongFormatKeyContainsObject(){
        String jsonStr = "[{\"name\":\"karthik\",\"array\":{a:\"a\",b:\"b\"}}]";
        boolean throwed = false;
        try {
            JsonValidator.validate(jsonStr);
        }catch(Exception e){
            throwed = true;
        }
        assertTrue(throwed);
    }
    @Test
    public void testWrongFormatNotAnArray(){
        String jsonStr = "{\"name\":\"karthik\",\"array\":{a:\"a\",b:\"b\"}}";
        boolean throwed = false;
        try {
            JsonValidator.validate(jsonStr);
        }catch(Exception e){
            throwed = true;
        }
        assertTrue(throwed);
    }
}
