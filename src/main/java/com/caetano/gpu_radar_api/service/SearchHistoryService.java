package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.search.SearchHistoryResponse;
import com.caetano.gpu_radar_api.entity.SearchHistory;
import com.caetano.gpu_radar_api.entity.UserAccount;
import com.caetano.gpu_radar_api.exception.ResourceNotFoundException;
import com.caetano.gpu_radar_api.mapper.SearchHistoryMapper;
import com.caetano.gpu_radar_api.repository.SearchHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SearchHistoryService {
    private final SearchHistoryRepository
            searchHistoryRepository;

    private final SearchHistoryMapper
            searchHistoryMapper;

    private final CurrentUserService
            currentUserService;

    public SearchHistoryService(
            SearchHistoryRepository searchHistoryRepository,
            SearchHistoryMapper searchHistoryMapper,
            CurrentUserService currentUserService
    ) {
        this.searchHistoryRepository =
                searchHistoryRepository;

        this.searchHistoryMapper =
                searchHistoryMapper;

        this.currentUserService =
                currentUserService;
    }

    public SearchHistoryResponse createSearchHistory(
            String searchedTerm,
            int resultCount,
            BigDecimal lowestPriceFound
    ) {
        UserAccount user =
                currentUserService.getCurrentUser();

        SearchHistory searchHistory =
                new SearchHistory(
                        searchedTerm,
                        resultCount,
                        lowestPriceFound,
                        user
                );

        SearchHistory savedSearchHistory =
                searchHistoryRepository.save(
                        searchHistory
                );

        return searchHistoryMapper.toResponse(
                savedSearchHistory
        );
    }

    public List<SearchHistoryResponse>
    getAllSearchHistory() {
        UserAccount user =
                currentUserService.getCurrentUser();

        return searchHistoryRepository
                .findAllByUser_IdOrderBySearchedAtDesc(
                        user.getId()
                )
                .stream()
                .map(
                        searchHistoryMapper::toResponse
                )
                .toList();
    }

    public SearchHistoryResponse
    getSearchHistoryById(Long id) {
        UserAccount user =
                currentUserService.getCurrentUser();

        SearchHistory searchHistory =
                searchHistoryRepository
                        .findByIdAndUser_Id(
                                id,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Search history with ID "
                                                + id
                                                + " was not found."
                                )
                        );

        return searchHistoryMapper.toResponse(
                searchHistory
        );
    }

    @Transactional
    public void clearSearchHistory() {
        UserAccount user =
                currentUserService.getCurrentUser();

        searchHistoryRepository
                .deleteAllByUser_Id(
                        user.getId()
                );
    }
}