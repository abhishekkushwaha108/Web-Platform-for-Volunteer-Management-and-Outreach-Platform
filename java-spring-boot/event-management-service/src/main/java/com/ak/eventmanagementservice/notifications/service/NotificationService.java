package com.ak.eventmanagementservice.notifications.service;

import com.ak.eventmanagementservice.notifications.dto.NotificationResponse;
import java.util.List;

public interface NotificationService {

    void notifySignup(
            String organizerId,
            String volunteerId,
            String eventId,
            String participationId
    );

    void notifyCancel(
            String organizerId,
            String volunteerId,
            String eventId,
            String participationId
    );

    List<NotificationResponse> getNotifications(String userId);

    NotificationResponse markAsRead(String id);

    void markAllAsRead(String userId);

    NotificationResponse getNotificationById(String id);
}
