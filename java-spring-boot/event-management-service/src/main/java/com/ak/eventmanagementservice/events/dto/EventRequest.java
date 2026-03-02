package com.ak.eventmanagementservice.events.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {

    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int requiredVolunteers;
    private String organizerId;
}