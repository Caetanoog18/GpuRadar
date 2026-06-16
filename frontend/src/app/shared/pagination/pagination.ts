import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type PaginationItem = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  @Input()
  currentPage = 1;

  @Input()
  totalPages = 1;

  @Output()
  pageChange = new EventEmitter<number>();

  get pageItems(): PaginationItem[] {
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    const items: PaginationItem[] = [1];

    if (this.currentPage > 4) {
      items.push('ellipsis');
    }

    const start = Math.max(2, this.currentPage - 1);

    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }

    if (this.currentPage < this.totalPages - 3) {
      items.push('ellipsis');
    }

    items.push(this.totalPages);

    return items;
  }

  goToPage(item: PaginationItem): void {
    if (item === 'ellipsis') {
      return;
    }

    const page = Math.min(Math.max(item, 1), this.totalPages);

    if (page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }

  previous(): void {
    this.goToPage(this.currentPage - 1);
  }

  next(): void {
    this.goToPage(this.currentPage + 1);
  }
}
