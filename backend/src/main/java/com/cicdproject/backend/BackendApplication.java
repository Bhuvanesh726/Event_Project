package com.cicdproject.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class BackendApplication extends SpringBootServletInitializer { // <-- CHANGED HERE

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// ADDED THIS METHOD
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(BackendApplication.class);
	}
}