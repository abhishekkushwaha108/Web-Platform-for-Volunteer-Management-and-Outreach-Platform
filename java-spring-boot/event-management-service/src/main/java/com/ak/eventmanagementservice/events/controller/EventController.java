package com.ak.eventmanagementservice.events.controller;

import com.ak.eventmanagementservice.events.dto.*;
import com.ak.eventmanagementservice.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // CREATE EVENT
    @PostMapping
    public EventResponse createEvent(@RequestBody EventRequest request) {
        return eventService.createEvent(request);
    }

    // SEARCH / LIST EVENTS (with filters)
    @GetMapping
    public Page<EventResponse> searchEvents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            @RequestParam(defaultValue = "false") boolean availableOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return eventService.searchEvents(q, from, to, availableOnly, page, size);
    }

    // EVENT DETAILS (with organizer + volunteers)
    @GetMapping("/{id}")
    public EventDetailsResponse getEvent(@PathVariable String id) {
        return eventService.getEventDetails(id);
    }

    // UPDATE EVENT
    @PutMapping("/{id}")
    public EventResponse updateEvent(@PathVariable String id,
                                     @RequestBody EventRequest request) {
        return eventService.updateEvent(id, request);
    }

    // CANCEL EVENT
    @PostMapping("/{id}/cancel")
    public EventResponse cancelEvent(@PathVariable String id) {
        return eventService.cancelEvent(id);
    }

    // DELETE EVENT (optional but useful)
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }
}