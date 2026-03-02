package com.ak.eventmanagementservice.participation.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ParticipationResponse {

    private String id;
    private String eventId;
    private String volunteerId;
    private String status;
    private String rolePlayed;
    private LocalDateTime signedUpAt;
    private LocalDateTime cancelledAt;
}