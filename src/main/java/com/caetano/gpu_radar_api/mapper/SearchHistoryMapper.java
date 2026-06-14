package com.caetano.gpu_radar_api.mapper;

import com.caetano.gpu_radar_api.dto.search.SearchHistoryResponse;
import com.caetano.gpu_radar_api.entity.SearchHistory;
import org.springframework.stereotype.Component;

@Component
public class SearchHistoryMapper {

    public SearchHistoryResponse toResponse(SearchHistory searchHistory){
        return new SearchHistoryResponse(
                searchHistory.getId(),
                searchHistory.getSearchedTerm(),
                searchHistory.getResultCount(),
                searchHistory.getLowestPriceFound(),
                searchHistory.getSearchedAt()
        );
    }
}
