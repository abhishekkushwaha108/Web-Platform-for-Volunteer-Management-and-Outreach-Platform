package com.ak.eventmanagementservice.participation.repository;

import com.ak.eventmanagementservice.participation.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipationRepository extends JpaRepository<Participation, String> {

    Optional<Participation> findByEventIdAndVolunteerId(String eventId, String volunteerId);

    List<Participation> findByVolunteerId(String volunteerId);

    List<Participation> findByEventId(String eventId);
}