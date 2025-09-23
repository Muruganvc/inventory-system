import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _requestCount = signal(0);

  show(): void {
    this._requestCount.update(count => count + 1);
  }

  hide(): void {
    this._requestCount.update(count => Math.max(0, count - 1));
  }

  readonly showSignal: Signal<boolean> = computed(() => this._requestCount() > 0);
}
