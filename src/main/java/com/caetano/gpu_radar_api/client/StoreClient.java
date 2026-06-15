package com.caetano.gpu_radar_api.client;

import com.caetano.gpu_radar_api.dto.product.ProductResponse;

import java.util.List;

public interface StoreClient {
    String getStoreName();
    List<ProductResponse> searchProducts(String searchTerm);
}
