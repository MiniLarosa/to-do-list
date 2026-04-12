import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';

interface FeatureFlagItem {
  key: string;
  description: string;
  value$: BehaviorSubject<boolean>;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab3Page {
  public remoteConfigService = inject(FirebaseRemoteConfigService);
  public isRefreshing = false;
  public readonly flags: FeatureFlagItem[] = [
    {
      key: 'show_welcome_banner',
      description: 'Hero / bienvenida en Tab1',
      value$: this.remoteConfigService.showWelcomeBanner$
    },
    {
      key: 'show_category_filter',
      description: 'Segmento de categorías en Tab1',
      value$: this.remoteConfigService.showCategoryFilter$
    },
    {
      key: 'enable_floating_add',
      description: 'FAB para alta rápida de tareas',
      value$: this.remoteConfigService.enableFloatingAdd$
    }
  ];

  get totalFeatureFlagsCount(): number {
    return this.flags.length;
  }

  get activeFeatureFlagsCount(): number {
    return this.flags.filter(flag => flag.value$.value).length;
  }

  get flagsProgress(): number {
    const total = this.totalFeatureFlagsCount;
    return total > 0 ? this.activeFeatureFlagsCount / total : 0;
  }

  trackByFlagKey(_index: number, flag: FeatureFlagItem): string {
    return flag.key;
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
