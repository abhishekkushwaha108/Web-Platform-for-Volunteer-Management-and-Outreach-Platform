package com.ak.eventmanagementservice.events.service;

import com.ak.eventmanagementservice.client.IdentityClient;
import com.ak.eventmanagementservice.events.dto.*;
import com.ak.eventmanagementservice.events.entity.Event;
import com.ak.eventmanagementservice.events.repository.EventRepository;
import com.ak.eventmanagementservice.exception.ResourceNotFoundException;
import com.ak.eventmanagementservice.participation.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final ParticipationRepository participationRepository;
    private final IdentityClient identityClient;

    // CREATE EVENT
    @Override
    public EventResponse createEvent(EventRequest request) {

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .requiredVolunteers(request.getRequiredVolunteers())
                .organizerId(request.getOrganizerId())
                .spotsFilled(0)
                .status("PUBLISHED")
                .build();

        return map(eventRepository.save(event));
    }

    // SEARCH EVENTS WITH FILTERS
    @Override
    public Page<EventResponse> searchEvents(String q,
                                            LocalDateTime from,
                                            LocalDateTime to,
                                            boolean availableOnly,
                                            int page,
                                            int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").descending());

        return eventRepository.search(q, from, to, availableOnly, pageable)
                .map(this::map);
    }

    // EVENT DETAILS WITH ORGANIZER + VOLUNTEERS
    @Override
    public EventDetailsResponse getEventDetails(String id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Object organizer = identityClient.getUser(event.getOrganizerId());
        var volunteers = participationRepository.findByEventId(id);

        return EventDetailsResponse.builder()
                .event(map(event))
                .organizer(organizer)
                .volunteers(volunteers)
                .build();
    }

    // UPDATE EVENT
    @Override
    public EventResponse updateEvent(String id, EventRequest request) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setRequiredVolunteers(request.getRequiredVolunteers());

        return map(eventRepository.save(event));
    }

    // CANCEL EVENT
    @Override
    public EventResponse cancelEvent(String id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setStatus("CANCELLED");
        return map(eventRepository.save(event));
    }

    // DELETE EVENT
    @Override
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    // MAPPER
    private EventResponse map(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .requiredVolunteers(event.getRequiredVolunteers())
                .spotsFilled(event.getSpotsFilled())
                .organizerId(event.getOrganizerId())
                .status(event.getStatus())
                .build();
    }
}