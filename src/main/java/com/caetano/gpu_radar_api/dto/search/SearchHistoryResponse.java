package com.caetano.gpu_radar_api.dto.search;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SearchHistoryResponse(
        Long id, String searchedTerm, Integer resultCount, BigDecimal lowestPriceFound, LocalDateTime searchedAt
) {
}
