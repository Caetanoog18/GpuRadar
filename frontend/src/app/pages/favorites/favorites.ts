import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Favorite } from '../../core/models/favorite';
import { FavoriteService } from '../../core/services/favorite';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-favorites',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Pagination,
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  private readonly favoriteService = inject(FavoriteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly pageSize = 6;

  readonly favorites = signal<Favorite[]>([]);
  readonly loading = signal(true);
  readonly clearing = signal(false);
  readonly hasError = signal(false);
  readonly currentPage = signal(1);

  readonly imageErrors = new Set<number>();

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.favorites().length / this.pageSize));
  });

  readonly paginatedFavorites = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;

    const end = start + this.pageSize;

    return this.favorites().slice(start, end);
  });

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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
    this.scrollToTop();
  }

  delete(id?: number): void {
    if (id === undefined) {
      return;
    }

    this.favoriteService.delete(id).subscribe({
      next: () => {
        this.favorites.update((items) => items.filter((item) => item.id !== id));

        this.imageErrors.delete(id);
        this.ensureValidPage();

        this.snackBar.open('Favorite removed.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Could not remove favorite.', 'Close', { duration: 3500 });
      },
    });
  }

  clearFavorites(): void {
    if (this.clearing() || this.favorites().length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Clear all favorites?\n\n' +
        'This will permanently remove all your ' +
        'saved GPU deals. This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    this.clearing.set(true);

    this.favoriteService.clearAll().subscribe({
      next: () => {
        this.favorites.set([]);
        this.imageErrors.clear();
        this.currentPage.set(1);
        this.clearing.set(false);

        this.snackBar.open('All favorites were removed.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.clearing.set(false);

        this.snackBar.open('Could not clear favorites.', 'Close', { duration: 3500 });
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
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  private ensureValidPage(): void {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }

  private scrollToTop(): void {
    document.querySelector('.page-header')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
