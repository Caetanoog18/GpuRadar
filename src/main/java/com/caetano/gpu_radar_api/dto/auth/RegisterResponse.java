package com.caetano.gpu_radar_api.dto.auth;

public record RegisterResponse(
        Long userId,
        String name,
        String email,
        String message
) {
}