package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.search.SearchHistoryResponse;
import com.caetano.gpu_radar_api.entity.SearchHistory;
import com.caetano.gpu_radar_api.exception.ResourceNotFoundException;
import com.caetano.gpu_radar_api.mapper.SearchHistoryMapper;
import com.caetano.gpu_radar_api.repository.SearchHistoryRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;
    private final SearchHistoryMapper searchHistoryMapper;

    public SearchHistoryService(SearchHistoryRepository searchHistoryRepository, SearchHistoryMapper searchHistoryMapper) {
        this.searchHistoryRepository = searchHistoryRepository;
        this.searchHistoryMapper = searchHistoryMapper;
    }

    public SearchHistoryResponse createSearchHistory(String searchedTerm, Integer resultCount, BigDecimal lowestPriceFound){
        SearchHistory searchHistory = new SearchHistory(searchedTerm, resultCount, lowestPriceFound);
        SearchHistory savedSearchHistory = searchHistoryRepository.save(searchHistory);
        return searchHistoryMapper.toResponse(searchHistoryRepository.save(searchHistory));
    }

    public List<SearchHistoryResponse> getAllSearchHistories(){
        return searchHistoryRepository.findAll().stream().map(searchHistoryMapper::toResponse).toList();
    }

    public SearchHistoryResponse getSearchHistoryById(Long id){
        SearchHistory searchHistory = searchHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Search history with ID " + id + " was not found"));
        return searchHistoryMapper.toResponse(searchHistory);
    }
}
