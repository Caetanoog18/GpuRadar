import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductSearchResponse } from '../models/product-search-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  search(name: string): Observable<ProductSearchResponse> {
    const params = new HttpParams().set('name', name);

    return this.http.get<ProductSearchResponse>('/api/products', { params });
  }
}
