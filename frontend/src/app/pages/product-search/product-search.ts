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

  query = '';

  products = signal<Product[]>([]);
  bestOffer = signal<Product | null>(null);
  resultCount = signal(0);
  loading = signal(false);
  searched = signal(false);

  search(): void {
    const value = this.query.trim();

    if (!value) {
      this.snackBar.open('Enter a GPU model', 'Close', { duration: 2500 });

      return;
    }

    this.loading.set(true);
    this.searched.set(true);
    this.products.set([]);
    this.bestOffer.set(null);

    this.productService
      .search(value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.products.set(response.results);
          this.bestOffer.set(response.bestOffer);
          this.resultCount.set(response.resultCount);
        },
        error: () => {
          this.products.set([]);
          this.bestOffer.set(null);
          this.resultCount.set(0);

          this.snackBar.open('Unable to fetch products.', 'Close', { duration: 4000 });
        },
      });
  }

  isBestOffer(product: Product): boolean {
    const best = this.bestOffer();

    if (!best) {
      return false;
    }

    return product.url === best.url;
  }

  addFavorite(product: Product): void {
    this.favoriteService.create(product).subscribe({
      next: () => {
        this.snackBar.open('Product added to favorites.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Unable to add favorite.', 'Fechar', { duration: 3500 });
      },
    });
  }
}
