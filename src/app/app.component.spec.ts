import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { StorageService } from './services/storage.service';
import { TaskService } from './services/task.service';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';

describe('AppComponent', () => {
  const storageServiceMock = {
    init: jasmine.createSpy('init').and.resolveTo(),
  };

  const taskServiceMock = {
    loadCategories: jasmine.createSpy('loadCategories').and.resolveTo(),
    loadTasks: jasmine.createSpy('loadTasks').and.resolveTo(),
  };

  const remoteConfigServiceMock = {
    initialize: jasmine.createSpy('initialize').and.resolveTo(),
    showWelcomeBanner$: new BehaviorSubject(false),
    enableFloatingAdd$: new BehaviorSubject(false),
    showCategoryFilter$: new BehaviorSubject(true),
    showCategoryColors$: new BehaviorSubject(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: FirebaseRemoteConfigService, useValue: remoteConfigServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('inicializa storage, datos y remote config al arrancar', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    flushMicrotasks();
    tick();
    flushMicrotasks();

    expect(storageServiceMock.init).toHaveBeenCalledTimes(1);
    expect(taskServiceMock.loadCategories).toHaveBeenCalledTimes(1);
    expect(taskServiceMock.loadTasks).toHaveBeenCalledTimes(1);
    expect(remoteConfigServiceMock.initialize).toHaveBeenCalledTimes(1);
  }));
});
