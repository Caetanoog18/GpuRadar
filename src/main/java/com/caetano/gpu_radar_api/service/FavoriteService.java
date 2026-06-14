package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.favorite.FavoriteRequest;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteResponse;
import com.caetano.gpu_radar_api.dto.favorite.StatusResponse;
import com.caetano.gpu_radar_api.entity.Favorite;
import com.caetano.gpu_radar_api.mapper.FavoriteMapper;
import com.caetano.gpu_radar_api.repository.FavoriteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final FavoriteMapper favoriteMapper;

    public FavoriteService(FavoriteRepository favoriteRepository, FavoriteMapper favoriteMapper) {
        this.favoriteRepository = favoriteRepository;
        this.favoriteMapper = favoriteMapper;
    }

    public StatusResponse createFavorite(FavoriteRequest request){
        if(favoriteRepository.existsByUrl(request.url())){
            throw new IllegalArgumentException("A Favorite product with this URL already exists");
        };

        Favorite favorite = favoriteMapper.toEntity(request);
        Favorite savedFavorite = favoriteRepository.save(favorite);

        return new StatusResponse(
                "SUCCESS",
                "Favorite created successfully!",
                savedFavorite.getId()
        );
    }

    public FavoriteResponse getFavoriteById(Long id){
        Favorite favorite = favoriteRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Favorite not found"));
        return favoriteMapper.toResponse(favorite);
    }

    public List<FavoriteResponse> getAllFavorites(){
        return favoriteRepository.findAll().stream().map(favoriteMapper::toResponse).toList();
    }

    public void deleteFavorite(Long id){
        if(!favoriteRepository.existsById(id)){
            throw new IllegalArgumentException("Favorite not found");
        }
        favoriteRepository.deleteById(id);
    }

}
