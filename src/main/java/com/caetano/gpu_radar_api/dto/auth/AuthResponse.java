package com.caetano.gpu_radar_api.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email) {
}