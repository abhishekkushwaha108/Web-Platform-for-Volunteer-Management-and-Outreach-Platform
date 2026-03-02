package com.ak.eventmanagementservice.participation.service;

import com.ak.eventmanagementservice.events.entity.Event;
import com.ak.eventmanagementservice.events.repository.EventRepository;
import com.ak.eventmanagementservice.exception.*;
import com.ak.eventmanagementservice.notifications.service.NotificationService;
import com.ak.eventmanagementservice.participation.dto.*;
import com.ak.eventmanagementservice.participation.entity.Participation;
import com.ak.eventmanagementservice.participation.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationServiceImpl implements ParticipationService {

    private final ParticipationRepository participationRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    // SIGNUP
    @Override
    public ParticipationResponse signup(SignupRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if ("CANCELLED".equals(event.getStatus()))
            throw new BadRequestException("Event is cancelled");

        if (event.getSpotsFilled() >= event.getRequiredVolunteers())
            throw new ConflictException("Event is full");

        participationRepository.findByEventIdAndVolunteerId(
                request.getEventId(), request.getVolunteerId()
        ).ifPresent(p -> { throw new ConflictException("Already signed up"); });

        Participation participation = Participation.builder()
                .eventId(request.getEventId())
                .volunteerId(request.getVolunteerId())
                .status("CONFIRMED")
                .signedUpAt(LocalDateTime.now())
                .build();

        event.setSpotsFilled(event.getSpotsFilled() + 1);
        eventRepository.save(event);

        Participation saved = participationRepository.save(participation);

        // ✅ Notification with participationId
        notificationService.notifySignup(
                event.getOrganizerId(),
                saved.getVolunteerId(),
                event.getId(),
                saved.getId()
        );

        return map(saved);
    }

    // CANCEL PARTICIPATION
    @Override
    public ParticipationResponse cancel(String participationId) {

        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new ResourceNotFoundException("Participation not found"));

        if ("CANCELLED".equals(participation.getStatus()))
            throw new ConflictException("Already cancelled");

        Event event = eventRepository.findById(participation.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Spec rule — cannot cancel after event end
        if (LocalDateTime.now().isAfter(event.getEndTime())) {
            throw new BadRequestException("Cannot cancel after event end");
        }

        participation.setStatus("CANCELLED");
        participation.setCancelledAt(LocalDateTime.now());

        event.setSpotsFilled(Math.max(0, event.getSpotsFilled() - 1));
        eventRepository.save(event);

        Participation saved = participationRepository.save(participation);

        // ✅ Notification with participationId
        notificationService.notifyCancel(
                event.getOrganizerId(),
                saved.getVolunteerId(),
                event.getId(),
                saved.getId()
        );

        return map(saved);
    }

    // HISTORY
    @Override
    public List<ParticipationResponse> history(String volunteerId) {
        return participationRepository.findByVolunteerId(volunteerId)
                .stream()
                .map(this::map)
                .toList();
    }

    // UPDATE PARTICIPATION
    @Override
    public ParticipationResponse updateParticipation(String id,
                                                     UpdateParticipationRequest request) {

        Participation participation = participationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participation not found"));

        participation.setStatus(request.getStatus());
        participation.setRolePlayed(request.getRolePlayed());

        return map(participationRepository.save(participation));
    }

    private ParticipationResponse map(Participation p) {
        return ParticipationResponse.builder()
                .id(p.getId())
                .eventId(p.getEventId())
                .volunteerId(p.getVolunteerId())
                .status(p.getStatus())
                .rolePlayed(p.getRolePlayed())
                .signedUpAt(p.getSignedUpAt())
                .cancelledAt(p.getCancelledAt())
                .build();
    }
}