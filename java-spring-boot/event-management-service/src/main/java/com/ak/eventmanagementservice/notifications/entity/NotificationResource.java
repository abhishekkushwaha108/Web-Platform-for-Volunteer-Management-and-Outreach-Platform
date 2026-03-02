package com.ak.eventmanagementservice.notifications.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResource {

    private String eventId;
    private String participationId;
}