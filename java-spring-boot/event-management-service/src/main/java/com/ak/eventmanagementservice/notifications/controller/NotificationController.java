package com.ak.eventmanagementservice.notifications.controller;

import com.ak.eventmanagementservice.notifications.dto.NotificationRequest;
import com.ak.eventmanagementservice.notifications.dto.NotificationResponse;
import com.ak.eventmanagementservice.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    
    @PostMapping("/create")
    public void createNotification(@RequestBody NotificationRequest request) {

        notificationService.notifySignup(
                request.getOrganizerId(),
                request.getVolunteerId(),
                request.getEventId(),
                request.getParticipationId()
        );
    }

    // Get notifications for a user
    
    @GetMapping
    public List<NotificationResponse> getNotifications(
            @RequestParam String userId,
            @RequestParam(required = false) Boolean read,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return notificationService.getNotifications(userId);
    }

    /**
     * Get notification by ID
     */
    @GetMapping("/{id}")
    public NotificationResponse getNotificationById(@PathVariable String id) {
        return notificationService.getNotificationById(id);
    }

    /**
     * Mark notification as read
     */
    @PatchMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }

    /**
     * Mark all notifications as read for a user
     */
    @PatchMapping("/read-all")
    public void markAllAsRead(@RequestParam String userId) {
        notificationService.markAllAsRead(userId);
    }

}