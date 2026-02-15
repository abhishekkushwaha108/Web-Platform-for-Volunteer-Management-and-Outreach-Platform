package com.ak.usermanagement.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

