package com.ak.eventmanagementservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-MANAGEMENT-SERVICE")
public interface IdentityClient {

    @GetMapping("/api/users/{id}")
    Object getUser(@PathVariable("id") String id);
}