package com.caetano.gpu_radar_api.dto.favorite;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FavoriteResponse(
        Long id,
        String name,
        String store,
        BigDecimal price,
        String url,
        String imageUrl,
        LocalDateTime createdAt
) {
}
