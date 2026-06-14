package com.caetano.gpu_radar_api.dto.product;

import java.util.List;

public record ProductSearchResponse(
        String searchedTerm, int resultCount, ProductResponse bestOffer, List<ProductResponse> results
) {
}
