import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SearchHistory } from '../models/search-history';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/search-history';

  findAll(): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(this.apiUrl);
  }

  findById(id: number): Observable<SearchHistory> {
    return this.http.get<SearchHistory>(`${this.apiUrl}/${id}`);
  }

  clearAll(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
