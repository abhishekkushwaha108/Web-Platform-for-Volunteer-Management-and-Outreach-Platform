package com.ak.eventmanagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EntityScan("com.ak.eventmanagementservice")
@EnableFeignClients
public class EventManagementServiceApplication {

	public static void main(String[] args) {

		SpringApplication.run(EventManagementServiceApplication.class, args);
	}

}
