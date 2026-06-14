package com.caetano.gpu_radar_api.repository;

import com.caetano.gpu_radar_api.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
}
