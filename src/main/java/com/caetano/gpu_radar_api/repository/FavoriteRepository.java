package com.caetano.gpu_radar_api.repository;

import com.caetano.gpu_radar_api.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findAllByUser_IdOrderByCreatedAtDesc(Long userId);

    Optional<Favorite> findByIdAndUser_Id(Long id, Long userId);

    boolean existsByUrlAndUser_Id(String url, Long userId);
}