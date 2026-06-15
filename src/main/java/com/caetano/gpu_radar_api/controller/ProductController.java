package com.caetano.gpu_radar_api.controller;

import com.caetano.gpu_radar_api.dto.product.ProductResponse;
import com.caetano.gpu_radar_api.dto.product.ProductSearchResponse;
import com.caetano.gpu_radar_api.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/products")
@Tag(name="Products", description="GPU search and comparison operations")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(summary="Search products", description="Searches GPU products and returns the best offers")
    @GetMapping
    public ProductSearchResponse searchProducts(@RequestParam("name") String searchTerm){
        return productService.searchProducts(searchTerm);
    }

    @Operation(summary = "Get best offer", description = "Returns the lowest price found for a GPU."
    )
    @GetMapping("/best-offer")
    public ProductResponse getBestOffer(@RequestParam("name") String searchTerm){
        return productService.getBestOffer(searchTerm);
    }
}