package com.ak.identity.auth.controller;

import com.ak.identity.auth.dto.AuthResponse;
import com.ak.identity.auth.dto.LoginRequest;
import com.ak.identity.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}