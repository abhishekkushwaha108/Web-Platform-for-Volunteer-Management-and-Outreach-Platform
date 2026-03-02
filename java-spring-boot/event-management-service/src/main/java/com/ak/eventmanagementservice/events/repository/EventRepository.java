package com.ak.eventmanagementservice.events.repository;

import com.ak.eventmanagementservice.events.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface EventRepository extends JpaRepository<Event, String> {

    @Query("""
        SELECT e FROM Event e
        WHERE (:q IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(e.description) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:from IS NULL OR e.startTime >= :from)
          AND (:to IS NULL OR e.endTime <= :to)
          AND (:availableOnly = FALSE OR e.spotsFilled < e.requiredVolunteers)
    """)
    Page<Event> search(@Param("q") String q,
                       @Param("from") LocalDateTime from,
                       @Param("to") LocalDateTime to,
                       @Param("availableOnly") boolean availableOnly,
                       Pageable pageable);
}