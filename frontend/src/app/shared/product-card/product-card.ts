import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({
    required: true,
  })
  product!: Product;

  @Input()
  bestOffer = false;

  @Input()
  favorited = false;

  @Input()
  favoriteLoading = false;

  @Output()
  favoriteToggle = new EventEmitter<Product>();

  readonly imageError = signal(false);

  toggleFavorite(): void {
    if (this.favoriteLoading) {
      return;
    }

    this.favoriteToggle.emit(this.product);
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  openProduct(): void {
    window.open(this.product.url, '_blank', 'noopener,noreferrer');
  }
}
