package com.ak.eventmanagementservice.notifications.controller;

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

    @GetMapping("/{userId}")
    public List<NotificationResponse> getNotifications(@PathVariable String userId) {
        return notificationService.getNotifications(userId);
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable String id) {
        return notificationService.markAsRead(id);
    }
}