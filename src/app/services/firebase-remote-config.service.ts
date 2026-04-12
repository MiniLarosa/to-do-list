import { Injectable, inject } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRemoteConfigService {
  private remoteConfig = inject(RemoteConfig);

  public showWelcomeBanner$ = new BehaviorSubject<boolean>(false);
  public enableFloatingAdd$ = new BehaviorSubject<boolean>(false);
  public showCategoryFilter$ = new BehaviorSubject<boolean>(true);
  public showCategoryColors$ = new BehaviorSubject<boolean>(true);

  constructor() {
    if (!environment.production) {
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    }
  }

  async initialize() {
    this.remoteConfig.defaultConfig = {
      show_welcome_banner: false,
      enable_floating_add: false,
      show_category_filter: true,
      show_category_colors: true
    };

    try {
      await fetchAndActivate(this.remoteConfig);
      this.updateFlags();
    } catch (error) {
      console.error('Error fetching remote config:', error);
      this.updateFlags();
    }
  }

  private updateFlags() {
    this.showWelcomeBanner$.next(getBoolean(this.remoteConfig, 'show_welcome_banner'));
    this.enableFloatingAdd$.next(getBoolean(this.remoteConfig, 'enable_floating_add'));
    this.showCategoryFilter$.next(getBoolean(this.remoteConfig, 'show_category_filter'));
    this.showCategoryColors$.next(getBoolean(this.remoteConfig, 'show_category_colors'));
  }
}
