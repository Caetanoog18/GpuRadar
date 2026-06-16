package com.caetano.gpu_radar_api.service;

import com.caetano.gpu_radar_api.dto.CommandResponse;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteRequest;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteResponse;
import com.caetano.gpu_radar_api.entity.Favorite;
import com.caetano.gpu_radar_api.entity.UserAccount;
import com.caetano.gpu_radar_api.exception.BusinessRuleException;
import com.caetano.gpu_radar_api.exception.ResourceNotFoundException;
import com.caetano.gpu_radar_api.mapper.FavoriteMapper;
import com.caetano.gpu_radar_api.repository.FavoriteRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final FavoriteMapper favoriteMapper;
    private final CurrentUserService currentUserService;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            FavoriteMapper favoriteMapper,
            CurrentUserService currentUserService
    ) {
        this.favoriteRepository = favoriteRepository;
        this.favoriteMapper = favoriteMapper;
        this.currentUserService = currentUserService;
    }

    public CommandResponse createFavorite(FavoriteRequest request) {
        UserAccount user = currentUserService.getCurrentUser();

        if (favoriteRepository.existsByUrlAndUser_Id(request.url(), user.getId())) {
            throw new BusinessRuleException("This product is already in your favorites.");
        }

        Favorite favorite = favoriteMapper.toEntity(request, user);
        Favorite savedFavorite = favoriteRepository.save(favorite);

        return new CommandResponse(
                "SUCCESS",
                "Favorite created successfully!",
                savedFavorite.getId()
        );
    }

    public List<FavoriteResponse> getAllFavorites() {
        UserAccount user = currentUserService.getCurrentUser();

        return favoriteRepository.findAllByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(favoriteMapper::toResponse)
                .toList();
    }

    public FavoriteResponse getFavoriteById(Long id) {
        UserAccount user = currentUserService.getCurrentUser();

        Favorite favorite = favoriteRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Favorite with ID " + id + " was not found."
                ));

        return favoriteMapper.toResponse(favorite);
    }

    public void deleteFavorite(Long id) {
        UserAccount user = currentUserService.getCurrentUser();

        Favorite favorite = favoriteRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Favorite with ID " + id + " was not found."
                ));

        favoriteRepository.delete(favorite);
    }

    @Transactional
    public void clearFavorites() {
        UserAccount user =
                currentUserService.getCurrentUser();

        favoriteRepository.deleteAllByUser_Id(
                user.getId()
        );
    }
}