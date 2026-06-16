import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product } from '../../core/models/product';
import { Favorite } from '../../core/models/favorite';

import { ProductService } from '../../core/services/product';
import { FavoriteService } from '../../core/services/favorite';
import { ProductSearchState } from '../../core/services/product-search-state';

import { ProductCard } from '../../shared/product-card/product-card';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-product-search',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductCard,
    Pagination,
  ],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearch implements OnInit {
  private readonly productService = inject(ProductService);

  private readonly favoriteService = inject(FavoriteService);

  private readonly snackBar = inject(MatSnackBar);

  private readonly searchState = inject(ProductSearchState);

  private readonly pageSize = 12;

  readonly loading = signal(false);
  readonly currentPage = signal(1);

  readonly favoriteIds = signal<Map<string, number>>(new Map<string, number>());

  readonly favoriteRequests = signal<Set<string>>(new Set<string>());

  readonly products = this.searchState.products;

  readonly bestOffer = this.searchState.bestOffer;

  readonly resultCount = this.searchState.resultCount;

  readonly searched = this.searchState.searched;

  readonly totalPages = computed(() => {
    const totalProducts = this.products().length;

    return Math.max(1, Math.ceil(totalProducts / this.pageSize));
  });

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;

    const end = start + this.pageSize;

    return this.products().slice(start, end);
  });

  get query(): string {
    return this.searchState.query();
  }

  set query(value: string) {
    this.searchState.updateQuery(value);
  }

  ngOnInit(): void {

    this.loadFavorites();
  }

  search(): void {
    const value = this.query.trim();

    if (!value) {
      this.snackBar.open('Enter a GPU model.', 'Close', {
        duration: 2500,
      });

      return;
    }

    this.loading.set(true);

    this.productService
      .search(value)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.searchState.saveSearch(
            value,
            response.results,
            response.bestOffer,
            response.resultCount,
          );

          this.currentPage.set(1);
        },
        error: () => {
          this.snackBar.open('Could not search for products.', 'Close', {
            duration: 4000,
          });
        },
      });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);

    document.querySelector('.section-header')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  isBestOffer(product: Product): boolean {
    const best = this.bestOffer();

    return best !== null && product.url === best.url;
  }

  isFavorite(product: Product): boolean {
    return this.favoriteIds().has(product.url);
  }

  isFavoriteLoading(product: Product): boolean {
    return this.favoriteRequests().has(product.url);
  }

  toggleFavorite(product: Product): void {
    if (this.isFavoriteLoading(product)) {
      return;
    }

    const favoriteId = this.favoriteIds().get(product.url);

    if (favoriteId !== undefined && favoriteId > 0) {
      this.removeFavorite(product, favoriteId);

      return;
    }

    if (favoriteId === -1) {
      return;
    }

    this.addFavorite(product);
  }

  private addFavorite(product: Product): void {
    const optimisticFavorites = new Map(this.favoriteIds());

    optimisticFavorites.set(product.url, -1);

    this.favoriteIds.set(optimisticFavorites);

    this.setFavoriteLoading(product.url, true);

    this.favoriteService
      .create(product)
      .pipe(
        finalize(() => {
          this.setFavoriteLoading(product.url, false);
        }),
      )
      .subscribe({
        next: (favorite) => {
          this.addFavoriteToState(product.url, favorite);

          this.snackBar.open('Product added to favorites.', 'Close', {
            duration: 2500,
          });
        },

        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.loadFavorites();

            this.snackBar.open('Product is already in favorites.', 'Close', {
              duration: 3000,
            });

            return;
          }

          const restoredFavorites = new Map(this.favoriteIds());

          restoredFavorites.delete(product.url);

          this.favoriteIds.set(restoredFavorites);

          this.snackBar.open('Could not add favorite.', 'Close', {
            duration: 3500,
          });
        },
      });
  }

  private removeFavorite(product: Product, favoriteId: number): void {
    const previousFavorites = new Map(this.favoriteIds());

    const optimisticFavorites = new Map(this.favoriteIds());

    optimisticFavorites.delete(product.url);

    this.favoriteIds.set(optimisticFavorites);

    this.setFavoriteLoading(product.url, true);

    this.favoriteService
      .delete(favoriteId)
      .pipe(
        finalize(() => {
          this.setFavoriteLoading(product.url, false);
        }),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Favorite removed.', 'Close', {
            duration: 2500,
          });
        },

        error: () => {
          this.favoriteIds.set(previousFavorites);

          this.snackBar.open('Could not remove favorite.', 'Close', {
            duration: 3500,
          });
        },
      });
  }

  private loadFavorites(): void {
    this.favoriteService.findAll().subscribe({
      next: (favorites) => {
        const favoriteMap = new Map<string, number>();

        for (const favorite of favorites) {
          if (favorite.id !== undefined) {
            favoriteMap.set(favorite.url, favorite.id);
          }
        }

        this.favoriteIds.set(favoriteMap);
      },

      error: () => {
        this.favoriteIds.set(new Map<string, number>());
      },
    });
  }

  private addFavoriteToState(productUrl: string, favorite: Favorite): void {

    if (favorite.id === undefined) {
      this.loadFavorites();

      return;
    }

    const updatedFavorites = new Map(this.favoriteIds());

    updatedFavorites.set(productUrl, favorite.id);

    this.favoriteIds.set(updatedFavorites);
  }

  private setFavoriteLoading(productUrl: string, loading: boolean): void {
    const requests = new Set(this.favoriteRequests());

    if (loading) {
      requests.add(productUrl);
    } else {
      requests.delete(productUrl);
    }

    this.favoriteRequests.set(requests);
  }
}
