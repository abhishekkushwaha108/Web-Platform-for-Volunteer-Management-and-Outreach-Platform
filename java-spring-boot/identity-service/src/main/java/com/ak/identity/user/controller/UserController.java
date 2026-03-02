package com.ak.identity.user.controller;

import com.ak.identity.auth.dto.AuthResponse;
import com.ak.identity.auth.dto.LoginRequest;
import com.ak.identity.user.entity.User;
import com.ak.identity.user.service.UserService;
import com.ak.identity.auth.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // REGISTER (moved here as entry point)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }
}