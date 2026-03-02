package com.ak.eventmanagementservice.events.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {

    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int requiredVolunteers;
    private int spotsFilled;
    private String organizerId;
    private String status;
}