package com.ak.eventmanagementservice.events.service;

import com.ak.eventmanagementservice.events.dto.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

public interface EventService {

    EventResponse createEvent(EventRequest request);

    Page<EventResponse> searchEvents(String q,
                                     LocalDateTime from,
                                     LocalDateTime to,
                                     boolean availableOnly,
                                     int page,
                                     int size);

    EventDetailsResponse getEventDetails(String id);

    EventResponse updateEvent(String id, EventRequest request);

    EventResponse cancelEvent(String id);

    void deleteEvent(String id);
}