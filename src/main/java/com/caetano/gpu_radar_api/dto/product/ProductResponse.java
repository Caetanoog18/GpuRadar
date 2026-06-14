package com.caetano.gpu_radar_api.dto.product;

import java.math.BigDecimal;

public record ProductResponse(String name, String store, BigDecimal price, String url, boolean simulated){
}