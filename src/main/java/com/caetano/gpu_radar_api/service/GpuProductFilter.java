package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.product.ProductResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GpuProductFilter {

    private static final List<String> GPU_INDICATORS = List.of(
            "placa de video",
            "placa de vídeo",
            "gpu",
            "graphics card",
            "video card",
            "geforce",
            "rtx",
            "gtx",
            "radeon",
            "rx ",
            "arc "
    );

    private static final List<String> BLOCKED_TERMS = List.of(
            "notebook",
            "laptop",
            "pc gamer",
            "computador",
            "desktop",
            "monitor",
            "teclado",
            "mouse",
            "console",
            "playstation",
            "xbox"
    );

    public boolean isGpuProduct(ProductResponse product) {
        if (product == null || product.name() == null) {
            return false;
        }

        String normalizedName = normalize(product.name());

        boolean hasGpuIndicator = GPU_INDICATORS.stream()
                .anyMatch(normalizedName::contains);

        boolean hasBlockedTerm = BLOCKED_TERMS.stream()
                .anyMatch(normalizedName::contains);

        return hasGpuIndicator && !hasBlockedTerm;
    }

    private String normalize(String value) {
        return value
                .toLowerCase()
                .replace("í", "i")
                .replace("é", "e")
                .replace("á", "a")
                .replace("ã", "a")
                .replace("ç", "c")
                .trim();
    }
}