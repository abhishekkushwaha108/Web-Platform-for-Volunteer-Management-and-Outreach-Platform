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

    @Override
    public List<NotificationResponse> getNotifications(String userId) {

        List<Notification> notifications = notificationRepository.findByToUserId(userId);

        return notifications.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse markAsRead(String id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    @Override
    public NotificationResponse getNotificationById(String id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        return mapToResponse(notification);
    }

    @Override
    public void markAllAsRead(String userId) {

        List<Notification> notifications = notificationRepository.findByToUserId(userId);

        notifications.forEach(notification -> notification.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    private NotificationResponse mapToResponse(Notification n) {

        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt(),
                n.getResource() != null ? n.getResource().getEventId() : null,
                n.getResource() != null ? n.getResource().getParticipationId() : null
        );
    }
}