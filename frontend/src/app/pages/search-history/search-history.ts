import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SearchHistory as SearchHistoryModel } from '../../core/models/search-history';
import { SearchHistoryService } from '../../core/services/search-history';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-search-history',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Pagination,
  ],
  templateUrl: './search-history.html',
  styleUrl: './search-history.scss',
})
export class SearchHistory implements OnInit {
  private readonly searchHistoryService = inject(SearchHistoryService);

  private readonly snackBar = inject(MatSnackBar);

  private readonly pageSize = 8;

  readonly histories = signal<SearchHistoryModel[]>([]);

  readonly loading = signal(true);
  readonly clearing = signal(false);
  readonly hasError = signal(false);
  readonly currentPage = signal(1);

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.histories().length / this.pageSize));
  });

  readonly paginatedHistories = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;

    const end = start + this.pageSize;

    return this.histories().slice(start, end);
  });

  ngOnInit(): void {
    this.loadHistories();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);

    document.querySelector('.page-heading')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  clearHistory(): void {
    if (this.clearing() || this.histories().length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Clear your entire search history? ' + 'This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    this.clearing.set(true);

    this.searchHistoryService.clearAll().subscribe({
      next: () => {
        this.histories.set([]);
        this.currentPage.set(1);
        this.clearing.set(false);

        this.snackBar.open('Search history cleared.', 'Close', { duration: 2500 });
      },
      error: () => {
        this.clearing.set(false);

        this.snackBar.open('Could not clear search history.', 'Close', { duration: 3500 });
      },
    });
  }

  private loadHistories(): void {
    this.searchHistoryService.findAll().subscribe({
      next: (histories) => {
        this.histories.set(histories);
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }
}
