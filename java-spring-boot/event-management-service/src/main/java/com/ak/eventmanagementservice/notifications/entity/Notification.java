package com.ak.eventmanagementservice.notifications.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String toUserId;
    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    @Embedded
    private NotificationResource resource;
}