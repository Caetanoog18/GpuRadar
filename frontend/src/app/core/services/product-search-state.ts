import { Injectable, signal } from '@angular/core';

import { Product } from '../models/product';

interface StoredSearchState {
  query: string;
  products: Product[];
  bestOffer: Product | null;
  resultCount: number;
  searched: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSearchState {
  private readonly storageKey = 'gpu-radar-search-state';

  readonly query = signal('');
  readonly products = signal<Product[]>([]);
  readonly bestOffer = signal<Product | null>(null);
  readonly resultCount = signal(0);
  readonly searched = signal(false);

  constructor() {
    this.restore();
  }

  saveSearch(
    query: string,
    products: Product[],
    bestOffer: Product | null,
    resultCount: number,
  ): void {
    this.query.set(query);
    this.products.set(products);
    this.bestOffer.set(bestOffer);
    this.resultCount.set(resultCount);
    this.searched.set(true);

    this.persist();
  }

  updateQuery(query: string): void {
    this.query.set(query);
    this.persist();
  }

  clear(): void {
    this.query.set('');
    this.products.set([]);
    this.bestOffer.set(null);
    this.resultCount.set(0);
    this.searched.set(false);

    sessionStorage.removeItem(this.storageKey);
  }

  private persist(): void {
    const state: StoredSearchState = {
      query: this.query(),
      products: this.products(),
      bestOffer: this.bestOffer(),
      resultCount: this.resultCount(),
      searched: this.searched(),
    };

    sessionStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private restore(): void {
    const storedState = sessionStorage.getItem(this.storageKey);

    if (!storedState) {
      return;
    }

    try {
      const state = JSON.parse(storedState) as StoredSearchState;

      this.query.set(state.query ?? '');
      this.products.set(state.products ?? []);
      this.bestOffer.set(state.bestOffer ?? null);
      this.resultCount.set(state.resultCount ?? 0);
      this.searched.set(state.searched ?? false);
    } catch {
      sessionStorage.removeItem(this.storageKey);
    }
  }
}
