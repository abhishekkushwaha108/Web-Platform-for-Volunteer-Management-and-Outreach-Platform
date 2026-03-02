package com.ak.identity.user.service;

import com.ak.identity.user.entity.User;
import com.ak.identity.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Register user logic
    public User register(User user) {

        // check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
}