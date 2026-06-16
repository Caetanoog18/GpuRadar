package com.caetano.gpu_radar_api.repository;

import com.caetano.gpu_radar_api.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findAllByUser_IdOrderBySearchedAtDesc(Long userId);
    Optional<SearchHistory> findByIdAndUser_Id(Long id, Long userId);
}