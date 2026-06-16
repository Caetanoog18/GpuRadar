package com.caetano.gpu_radar_api.controller;

import com.caetano.gpu_radar_api.dto.auth.AuthResponse;
import com.caetano.gpu_radar_api.dto.auth.LoginRequest;
import com.caetano.gpu_radar_api.dto.auth.RegisterRequest;
import com.caetano.gpu_radar_api.dto.auth.RegisterResponse;
import com.caetano.gpu_radar_api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}