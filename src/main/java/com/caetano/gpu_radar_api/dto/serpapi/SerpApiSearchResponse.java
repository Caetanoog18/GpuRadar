package com.caetano.gpu_radar_api.dto.serpapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SerpApiSearchResponse(
        @JsonProperty("shopping_results")
        List<SerpApiShoppingResult> shoppingResults
) {
}