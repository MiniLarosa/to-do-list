import { Component, inject } from '@angular/core';
import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  public remoteConfigService = inject(FirebaseRemoteConfigService);
  public isRefreshing = false;

  get activeFeatureFlagsCount(): number {
    return [
      this.remoteConfigService.showWelcomeBanner$.value,
      this.remoteConfigService.showCategoryFilter$.value,
      this.remoteConfigService.enableFloatingAdd$.value
    ].filter(Boolean).length;
  }

  async refreshRemoteConfig(): Promise<void> {
    if (this.isRefreshing) return;

    this.isRefreshing = true;
    try {
      await this.remoteConfigService.initialize();
    } finally {
      this.isRefreshing = false;
    }
  }
}
