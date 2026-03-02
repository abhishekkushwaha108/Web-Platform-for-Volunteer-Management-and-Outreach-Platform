package com.ak.eventmanagementservice.notifications.service;

import com.ak.eventmanagementservice.notifications.dto.NotificationResponse;
import com.ak.eventmanagementservice.notifications.entity.Notification;
import com.ak.eventmanagementservice.notifications.entity.NotificationResource;
import com.ak.eventmanagementservice.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    // SIGNUP NOTIFICATION
    @Override
    public void notifySignup(String organizerId,
                             String volunteerId,
                             String eventId,
                             String participationId) {

        Notification notification = Notification.builder()
                .toUserId(organizerId)
                .type("SIGNUP")
                .message("Volunteer " + volunteerId + " signed up for event " + eventId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .resource(NotificationResource.builder()
                        .eventId(eventId)
                        .participationId(participationId)
                        .build())
                .build();

        notificationRepository.save(notification);
    }

    // CANCEL NOTIFICATION
    @Override
    public void notifyCancel(String organizerId,
                             String volunteerId,
                             String eventId,
                             String participationId) {

        Notification notification = Notification.builder()
                .toUserId(organizerId)
                .type("CANCEL")
                .message("Volunteer " + volunteerId + " cancelled participation for event " + eventId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .resource(NotificationResource.builder()
                        .eventId(eventId)
                        .participationId(participationId)
                        .build())
                .build();

        notificationRepository.save(notification);
    }

    // GET USER NOTIFICATIONS
    @Override
    public List<NotificationResponse> getNotifications(String userId) {
        return notificationRepository.findByToUserId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    // MARK AS READ
    @Override
    public NotificationResponse markAsRead(String id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        return map(notificationRepository.save(notification));
    }

    // MAPPER
    private NotificationResponse map(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}