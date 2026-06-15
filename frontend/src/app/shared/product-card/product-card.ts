import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../../core/models/product';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true })
  product!: Product;

  @Input()
  bestOffer = false;

  @Output()
  favorite = new EventEmitter<Product>();

  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  openProduct(): void {
    window.open(this.product.url, '_blank', 'noopener,noreferrer');
  }
}
