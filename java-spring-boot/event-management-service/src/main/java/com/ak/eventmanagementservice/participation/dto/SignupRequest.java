package com.ak.eventmanagementservice.participation.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String eventId;
    private String volunteerId;
}