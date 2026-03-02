package com.ak.eventmanagementservice.notifications.service;

import com.ak.eventmanagementservice.notifications.dto.NotificationResponse;
import java.util.List;

public interface NotificationService {

    /**
     * Triggered when a volunteer signs up for an event
     */
    void notifySignup(
            String organizerId,
            String volunteerId,
            String eventId,
            String participationId
    );

    /**
     * Triggered when a volunteer cancels participation
     */
    void notifyCancel(
            String organizerId,
            String volunteerId,
            String eventId,
            String participationId
    );

    /**
     * Fetch all notifications for a user
     */
    List<NotificationResponse> getNotifications(String userId);

    /**
     * Mark a notification as read
     */
    NotificationResponse markAsRead(String id);
}