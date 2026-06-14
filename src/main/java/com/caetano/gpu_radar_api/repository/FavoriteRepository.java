package com.caetano.gpu_radar_api.repository;

import com.caetano.gpu_radar_api.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUrl(String url);

    List<Favorite> findByStoreContainingIgnoreCase(String store);
}

