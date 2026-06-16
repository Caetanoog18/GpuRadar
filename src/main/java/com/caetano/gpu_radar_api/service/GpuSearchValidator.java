package com.caetano.gpu_radar_api.service;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GpuSearchValidator {
    private static final List<String> GPU_TERMS = List.of(
            "gpu",
            "placa de video",
            "placa de vídeo",
            "video card",
            "graphics card",
            "geforce",
            "rtx",
            "gtx",
            "radeon",
            "rx",
            "arc",
            "nvidia",
            "amd",
            "intel arc"
    );

    public boolean isGpuSearch(String searchTerm) {
        if (searchTerm == null || searchTerm.isBlank()) {
            return false;
        }

        String normalizedTerm = normalize(searchTerm);

        return GPU_TERMS.stream()
                .anyMatch(normalizedTerm::contains);
    }

    private String normalize(String value) {
        return value
                .toLowerCase()
                .replace("í", "i")
                .replace("í", "i")
                .replace("é", "e")
                .replace("á", "a")
                .replace("ã", "a")
                .replace("ç", "c")
                .trim();
    }
}