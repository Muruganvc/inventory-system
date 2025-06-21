import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loading = signal(false);

  show() {
    this._loading.set(true);
  }

  hide() {
    this._loading.set(false);
  }

  readonly showSignal: Signal<boolean> = computed(() => this._loading());
}
