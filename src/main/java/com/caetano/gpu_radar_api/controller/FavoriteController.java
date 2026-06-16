package com.caetano.gpu_radar_api.controller;

import com.caetano.gpu_radar_api.dto.CommandResponse;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteRequest;
import com.caetano.gpu_radar_api.dto.favorite.FavoriteResponse;
import com.caetano.gpu_radar_api.service.FavoriteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "Favorites", description = "Favorite products management")
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommandResponse createFavorite(@RequestBody @Valid FavoriteRequest request) {
        return favoriteService.createFavorite(request);
    }

    @GetMapping("/{id}")
    public FavoriteResponse getFavoriteById(@PathVariable Long id) {
        return favoriteService.getFavoriteById(id);
    }

    @GetMapping
    public List<FavoriteResponse> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavorite(@PathVariable Long id) {
        favoriteService.deleteFavorite(id);
    }
}