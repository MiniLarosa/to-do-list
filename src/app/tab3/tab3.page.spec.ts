import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';
import { Tab3Page } from './tab3.page';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;

  const remoteConfigServiceMock = {
    showWelcomeBanner$: new BehaviorSubject(false),
    enableFloatingAdd$: new BehaviorSubject(false),
    showCategoryFilter$: new BehaviorSubject(true),
    showCategoryColors$: new BehaviorSubject(true),
    initialize: jasmine.createSpy('initialize').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab3Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: FirebaseRemoteConfigService, useValue: remoteConfigServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calcula cuantas flags están activas', () => {
    remoteConfigServiceMock.showWelcomeBanner$.next(true);
    remoteConfigServiceMock.enableFloatingAdd$.next(true);
    remoteConfigServiceMock.showCategoryFilter$.next(false);

    expect(component.activeFeatureFlagsCount).toBe(2);
  });

  it('refresca remote config sin duplicar ejecuciones simultáneas', fakeAsync(() => {
    component.refreshRemoteConfig();
    flushMicrotasks();

    expect(remoteConfigServiceMock.initialize).toHaveBeenCalledTimes(1);
    expect(component.isRefreshing).toBeFalse();
  }));
});
