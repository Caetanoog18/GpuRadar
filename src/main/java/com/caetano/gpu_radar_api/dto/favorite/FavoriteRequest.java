package com.caetano.gpu_radar_api.dto.favorite;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record FavoriteRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Store is required")
        String store,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price,

        @NotBlank(message = "URL is required")
        String url,

        String imageUrl
) {
}