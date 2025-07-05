import { Injectable, NgZone } from '@angular/core';
import { Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout = 1 * 60 * 1000; // 5 minutes
  private idle$ = new Subject<void>();
  private timeoutId: any;

  constructor(private zone: NgZone) {
    this.setupListeners();
    this.resetTimer();
  }

  private setupListeners(): void {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.zone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.zone.run(() => this.idle$.next());
      }, this.idleTimeout);
    });
  }

  onIdle() {
    return this.idle$.asObservable();
  }
}
