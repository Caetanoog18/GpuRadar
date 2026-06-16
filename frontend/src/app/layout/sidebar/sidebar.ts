import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth';
import { ProductSearchState } from '../../core/services/product-search-state';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly searchState = inject(ProductSearchState);

  clearSearch(): void {
    this.searchState.clear();
  }

  logout(): void {
    this.searchState.clear();
    this.authService.logout();

    void this.router.navigate(['/login']);
  }
}
