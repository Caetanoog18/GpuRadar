package com.caetano.gpu_radar_api.dto.favorite;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;

public record FavoriteRequest(
        @NotBlank(message = "Product name is required")
        String name,

        @NotBlank(message = "Store name is required")
        String store,

        @NotNull(message = "Price is required")
        @DecimalMin(value= "0.01", message = "Price must be greater than zero")
        BigDecimal price,

        @NotBlank(message = "Product URL is required")
        @URL(message = "Product URL must be valid")
        String url,

        String imageUrl
) {
}
