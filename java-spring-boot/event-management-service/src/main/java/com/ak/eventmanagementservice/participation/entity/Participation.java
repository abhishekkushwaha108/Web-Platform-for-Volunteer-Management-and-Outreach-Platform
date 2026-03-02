package com.ak.eventmanagementservice.participation.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "participations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String eventId;
    private String volunteerId;

    private String status; // CONFIRMED, CANCELLED, ATTENDED

    private String rolePlayed;

    private LocalDateTime signedUpAt;
    private LocalDateTime cancelledAt;
}