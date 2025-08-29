import { Component, inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <div class="loading-container">
          <div class="spinner"></div>
          <div class="loading-message">{{ loadingService.loadingMessage() }}</div>
        </div>
      </div>
    }
  `,
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  protected readonly loadingService = inject(LoadingService);
}