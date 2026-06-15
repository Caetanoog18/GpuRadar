package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.client.StoreClient;
import com.caetano.gpu_radar_api.dto.product.ProductResponse;
import com.caetano.gpu_radar_api.dto.product.ProductSearchResponse;
import com.caetano.gpu_radar_api.exception.BusinessRuleException;
import com.caetano.gpu_radar_api.exception.ExternalApiException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class ProductService {
    private final List<StoreClient> storeClients;
    private final SearchHistoryService searchHistoryService;
    private final GpuSearchValidator gpuSearchValidator;
    private final GpuProductFilter gpuProductFilter;

    public ProductService(
            List<StoreClient> storeClients,
            SearchHistoryService searchHistoryService,
            GpuSearchValidator gpuSearchValidator,
            GpuProductFilter gpuProductFilter
    ){
        this.storeClients = storeClients;
        this.searchHistoryService = searchHistoryService;
        this.gpuSearchValidator = gpuSearchValidator;
        this.gpuProductFilter = gpuProductFilter;
    }

    public ProductSearchResponse searchProducts(String searchTerm){
        validateSearchTerm(searchTerm);

        List<ProductResponse> products = storeClients.stream()
                .flatMap(storeClient -> searchSafely(storeClient, searchTerm).stream())
                .filter(this::isValidProduct)
                .filter(gpuProductFilter::isGpuProduct)
                .sorted(Comparator.comparing(ProductResponse::price))
                .toList();

        ProductResponse bestOffer = products.isEmpty() ? null : products.get(0);
        BigDecimal lowestPriceFound = bestOffer == null ? null : bestOffer.price();
        searchHistoryService.createSearchHistory(searchTerm, products.size(), lowestPriceFound);

        return new ProductSearchResponse(searchTerm, products.size(), bestOffer, products);

    }

    public ProductResponse getBestOffer(String searchTerm){
        ProductSearchResponse searchResponse = searchProducts(searchTerm);
        return searchResponse.bestOffer();
    }

    private List<ProductResponse> searchSafely(StoreClient storeClient, String searchTerm){
        try {
            return storeClient.searchProducts(searchTerm);
        } catch (ExternalApiException e) {
            return List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    private void validateSearchTerm(String searchTerm){
        if(searchTerm == null || searchTerm.isBlank()){
            throw new BusinessRuleException("Search term cannot be null or blank");
        }

        if (!gpuSearchValidator.isGpuSearch(searchTerm)) {
            throw new BusinessRuleException(
                    "Only GPU searches are allowed. Try terms like RTX 4060, GTX 1660, RX 7600 or placa de video."
            );
        }
    }

    private boolean isValidProduct(ProductResponse product){
        return product != null
                && product.name() != null
                && !product.name().isBlank()
                && product.store() != null
                && !product.store().isBlank()
                && product.price() != null
                && product.price().compareTo(BigDecimal.ZERO) > 0
                && product.url() != null
                && !product.url().isBlank();
    }
}
