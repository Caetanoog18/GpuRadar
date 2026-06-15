import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Favorite } from '../models/favorite';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/favorites';

  findAll(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  findById(id: number): Observable<Favorite> {
    return this.http.get<Favorite>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Favorite> {
    const request: Favorite = {
      name: product.name,
      store: product.store,
      price: product.price,
      url: product.url,
      imageUrl: product.imageUrl,
    };

    return this.http.post<Favorite>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
