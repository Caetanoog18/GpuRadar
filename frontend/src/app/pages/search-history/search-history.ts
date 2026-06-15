import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SearchHistory as SearchHistoryModel } from '../../core/models/search-history';
import { SearchHistoryService } from '../../core/services/search-history';

@Component({
  selector: 'app-search-history',
  imports: [CurrencyPipe, DatePipe, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './search-history.html',
  styleUrl: './search-history.scss',
})
export class SearchHistory implements OnInit {
  private readonly searchHistoryService = inject(SearchHistoryService);

  histories = signal<SearchHistoryModel[]>([]);
  loading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.loadHistories();
  }

  private loadHistories(): void {
    this.searchHistoryService.findAll().subscribe({
      next: (histories) => {
        this.histories.set(histories);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }
}
