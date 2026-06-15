package com.caetano.gpu_radar_api.dto.serpapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record SerpApiShoppingResult(
        String title,
        String source,
        String price,

        @JsonProperty("extracted_price")
        BigDecimal extractedPrice,

        @JsonProperty("product_link")
        String productLink,

        String link,

        String thumbnail

) {
}