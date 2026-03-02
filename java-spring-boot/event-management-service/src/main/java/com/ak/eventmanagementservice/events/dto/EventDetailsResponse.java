package com.ak.eventmanagementservice.events.dto;

import com.ak.eventmanagementservice.participation.entity.Participation;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class EventDetailsResponse {

    private EventResponse event;
    private Object organizer;
    private List<Participation> volunteers;
}