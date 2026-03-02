package com.ak.eventmanagementservice.events.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int requiredVolunteers;
    private int spotsFilled;

    private String organizerId;

    private String status; // PUBLISHED, CANCELLED
}