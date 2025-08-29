import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal(false);
  private _loadingMessage = signal('Loading...');
  
  // Read-only signals for components to subscribe to
  readonly isLoading = this._isLoading.asReadonly();
  readonly loadingMessage = this._loadingMessage.asReadonly();

  /**
   * Show the loading spinner with an optional message
   */
  show(message: string = 'Loading...'): void {
    this._loadingMessage.set(message);
    this._isLoading.set(true);
  }

  /**
   * Hide the loading spinner
   */
  hide(): void {
    this._isLoading.set(false);
    this._loadingMessage.set('Loading...');
  }

  /**
   * Simulate an async operation with loading state
   */
  async withLoading<T>(
    operation: () => Promise<T>, 
    message: string = 'Loading...'
  ): Promise<T> {
    this.show(message);
    try {
      const result = await operation();
      return result;
    } finally {
      this.hide();
    }
  }

  /**
   * Create a delay for simulating network calls
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulate a network call with random delay
   */
  async simulateNetworkCall(minMs: number = 800, maxMs: number = 2000): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    await this.delay(delay);
  }
}