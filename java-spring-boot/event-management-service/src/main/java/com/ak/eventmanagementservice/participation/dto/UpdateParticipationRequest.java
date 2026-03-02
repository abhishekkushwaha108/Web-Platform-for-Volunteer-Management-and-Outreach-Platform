package com.ak.eventmanagementservice.participation.dto;

import lombok.Data;

@Data
public class UpdateParticipationRequest {

    private String status;      // ATTENDED
    private String rolePlayed;
}