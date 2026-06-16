package com.caetano.gpu_radar_api.dto;

public record CommandResponse(
        String status,
        String message,
        Long id
) {
}