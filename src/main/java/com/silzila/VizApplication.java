package com.silzila;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

@SpringBootApplication
public class VizApplication {
	public static void main(String[] args) {
		SpringApplication.run(VizApplication.class, args);
	}
}
