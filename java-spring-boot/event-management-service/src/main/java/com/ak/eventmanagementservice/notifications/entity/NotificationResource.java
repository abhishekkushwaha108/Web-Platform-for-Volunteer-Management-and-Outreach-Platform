package com.ak.eventmanagementservice.notifications.entity;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResource {

    @Column(name = "event_id")
    private String eventId;

    @Column(name = "participation_id")
    private String participationId;
}