package com.caetano.gpu_radar_api.mapper;

import com.caetano.gpu_radar_api.dto.favorite.FavoriteRequest;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteResponse;
import com.caetano.gpu_radar_api.entity.Favorite;
import org.springframework.stereotype.Component;

@Component
public class FavoriteMapper {
    public Favorite toEntity(FavoriteRequest request){
        return new Favorite(request.name(), request.store(), request.price(), request.url(), request.imageUrl());
    }

    public FavoriteResponse toResponse(Favorite favorite){
        return new FavoriteResponse(
                favorite.getId(),
                favorite.getName(),
                favorite.getStore(),
                favorite.getPrice(),
                favorite.getUrl(),
                favorite.getImageUrl(),
                favorite.getCreatedAt());
    }
}
