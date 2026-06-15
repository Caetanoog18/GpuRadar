import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product';
import { FavoriteService } from '../../core/services/favorite';
import { ProductSearchState } from '../../core/services/product-search-state';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-search',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductCard,
  ],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearch {
  private readonly productService = inject(ProductService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly searchState = inject(ProductSearchState);

  get query(): string {
    return this.searchState.query();
  }

  set query(value: string) {
    this.searchState.updateQuery(value);
  }

  readonly products = this.searchState.products;
  readonly bestOffer = this.searchState.bestOffer;
  readonly resultCount = this.searchState.resultCount;
  readonly searched = this.searchState.searched;

  readonly loading = signal(false);

  search(): void {
    const value = this.query.trim();

    if (!value) {
      this.snackBar.open('Enter a GPU model.', 'Close', { duration: 2500 });

      return;
    }

    this.loading.set(true);

    this.productService
      .search(value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.searchState.saveSearch(
            value,
            response.results,
            response.bestOffer,
            response.resultCount,
          );
        },
        error: () => {
          this.snackBar.open('Could not search for products.', 'Close', { duration: 4000 });
        },
      });
  }

  isBestOffer(product: Product): boolean {
    const best = this.bestOffer();

    return best !== null && product.url === best.url;
  }

  addFavorite(product: Product): void {
    this.favoriteService.create(product).subscribe({
      next: () => {
        this.snackBar.open('Product added to favorites.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Could not add favorite.', 'Close', { duration: 3500 });
      },
    });
  }
}
