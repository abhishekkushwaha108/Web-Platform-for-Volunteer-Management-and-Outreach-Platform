package com.ak.eventmanagementservice.notifications.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private String id;
    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private String eventId;
    private String participationId;
}