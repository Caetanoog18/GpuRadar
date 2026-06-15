import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Favorite } from '../../core/models/favorite';
import { FavoriteService } from '../../core/services/favorite';

@Component({
  selector: 'app-favorites',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  private readonly favoriteService = inject(FavoriteService);

  private readonly snackBar = inject(MatSnackBar);

  favorites = signal<Favorite[]>([]);
  loading = signal(true);
  hasError = signal(false);

  imageErrors = new Set<number>();

  ngOnInit(): void {
    this.loadFavorites();
  }

  hasImageError(id?: number): boolean {
    return id !== undefined && this.imageErrors.has(id);
  }

  onImageError(id?: number): void {
    if (id !== undefined) {
      this.imageErrors.add(id);
    }
  }

  delete(id?: number): void {
    if (id === undefined) {
      return;
    }

    this.favoriteService.delete(id).subscribe({
      next: () => {
        this.favorites.update((items) => items.filter((item) => item.id !== id));

        this.imageErrors.delete(id);

        this.snackBar.open('Favorite removed.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Could not remove favorite.', 'Close', { duration: 3500 });
      },
    });
  }

  openProduct(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private loadFavorites(): void {
    this.favoriteService.findAll().subscribe({
      next: (favorites) => {
        this.favorites.set(favorites);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }
}
