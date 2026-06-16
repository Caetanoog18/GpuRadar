package com.caetano.gpu_radar_api.controller;

import com.caetano.gpu_radar_api.dto.search.SearchHistoryResponse;
import com.caetano.gpu_radar_api.service.SearchHistoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search-history")
@Tag(name = "Search History", description = "Search history operations")
public class SearchHistoryController {

    private final SearchHistoryService searchHistoryService;

    public SearchHistoryController(SearchHistoryService searchHistoryService) {
        this.searchHistoryService = searchHistoryService;
    }

    @GetMapping
    public List<SearchHistoryResponse> getAllSearchHistory() {
        return searchHistoryService.getAllSearchHistory();
    }

    @GetMapping("/{id}")
    public SearchHistoryResponse getSearchHistoryById(@PathVariable Long id) {
        return searchHistoryService.getSearchHistoryById(id);
    }
}