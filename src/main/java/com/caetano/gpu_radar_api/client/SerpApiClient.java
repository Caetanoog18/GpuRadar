package com.caetano.gpu_radar_api.client;

import com.caetano.gpu_radar_api.dto.product.ProductResponse;
import com.caetano.gpu_radar_api.dto.serpapi.SerpApiSearchResponse;
import com.caetano.gpu_radar_api.dto.serpapi.SerpApiShoppingResult;
import com.caetano.gpu_radar_api.exception.ExternalApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Component
public class SerpApiClient implements StoreClient {
    private static final String STORE_NAME = "Google Shopping";
    private final RestClient restClient;
    private final String apiKey;

    public SerpApiClient(
            @Value("${serpapi.base-url}") String baseUrl,
            @Value("${serpapi.api-key}") String apiKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.apiKey = apiKey;
    }

    @Override
    public String getStoreName() {
        return STORE_NAME;
    }

    @Override
    public List<ProductResponse> searchProducts(String searchTerm) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ExternalApiException("SerpApi API key is not configured.");
        }

        try {
            SerpApiSearchResponse response = restClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search.json")
                            .queryParam("engine", "google_shopping")
                            .queryParam("q", searchTerm)
                            .queryParam("location", "Brazil")
                            .queryParam("gl", "br")
                            .queryParam("hl", "pt")
                            .queryParam("num", 12)
                            .queryParam("api_key", apiKey)
                            .build()
                    )
                    .retrieve()
                    .body(SerpApiSearchResponse.class);

            if (response == null || response.shoppingResults() == null) {
                return List.of();
            }

            return response.shoppingResults()
                    .stream()
                    .filter(this::isValidResult)
                    .limit(12)
                    .map(this::toProductResponse)
                    .toList();

        } catch (RestClientException exception) {
            throw new ExternalApiException(
                    "Could not search products on SerpApi.",
                    exception
            );
        }
    }

    private boolean isValidResult(SerpApiShoppingResult result) {
        return result != null
                && result.title() != null
                && !result.title().isBlank()
                && result.extractedPrice() != null
                && result.extractedPrice().signum() > 0
                && getProductUrl(result) != null
                && !getProductUrl(result).isBlank();
    }

    private ProductResponse toProductResponse(SerpApiShoppingResult result) {
        return new ProductResponse(
                result.title(),
                getStoreNameFromResult(result),
                result.extractedPrice(),
                getProductUrl(result),
                result.thumbnail(),
                false
        );
    }

    private String getStoreNameFromResult(SerpApiShoppingResult result) {
        if (result.source() == null || result.source().isBlank()) {
            return STORE_NAME;
        }

        return result.source();
    }

    private String getProductUrl(SerpApiShoppingResult result) {
        if (result.productLink() != null && !result.productLink().isBlank()) {
            return result.productLink();
        }

        return result.link();
    }
}