package com.ak.eventmanagementservice.notifications.repository;

import com.ak.eventmanagementservice.notifications.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByToUserId(String userId);

}