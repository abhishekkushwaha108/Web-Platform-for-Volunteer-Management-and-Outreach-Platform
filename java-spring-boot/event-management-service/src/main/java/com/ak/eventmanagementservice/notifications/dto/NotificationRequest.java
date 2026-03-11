package com.ak.eventmanagementservice.notifications.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {

    private String organizerId;
    private String volunteerId;
    private String eventId;
    private String participationId;
}
