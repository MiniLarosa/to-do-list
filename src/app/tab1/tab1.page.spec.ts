import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';

import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';
import { TaskService } from '../services/task.service';
import { Category, Task } from '../models/task.model';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  const tasksSubject = new BehaviorSubject<Task[]>([]);
  const categoriesSubject = new BehaviorSubject<Category[]>([]);

  const taskServiceMock = {
    tasks$: tasksSubject.asObservable(),
    categories$: categoriesSubject.asObservable(),
    toggleTask: jasmine.createSpy('toggleTask').and.resolveTo(),
    deleteTask: jasmine.createSpy('deleteTask').and.resolveTo(),
    addTask: jasmine.createSpy('addTask').and.resolveTo(),
  };

  const remoteConfigServiceMock = {
    showWelcomeBanner$: new BehaviorSubject(false),
    enableFloatingAdd$: new BehaviorSubject(false),
    showCategoryFilter$: new BehaviorSubject(true),
    showCategoryColors$: new BehaviorSubject(true),
    initialize: jasmine.createSpy('initialize').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot(), ScrollingModule],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: FirebaseRemoteConfigService, useValue: remoteConfigServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filtra tareas y calcula estadísticas por categoría', () => {
    categoriesSubject.next([
      { id: 'cat-1', name: 'Trabajo', color: '#ffc409', createdAt: new Date(), updatedAt: new Date() },
    ]);
    tasksSubject.next([
      { id: 't1', title: 'Terminar informe', description: '', completed: false, categoryId: 'cat-1', createdAt: new Date(), updatedAt: new Date() },
      { id: 't2', title: 'Llamar cliente', description: '', completed: true, categoryId: 'cat-1', createdAt: new Date(), updatedAt: new Date() },
    ]);
    component.selectedCategoryId = 'cat-1';
    component['applyFilters']();

    expect(component.filteredTasks.length).toBe(2);
    expect(component.taskStats.total).toBe(2);
    expect(component.taskStats.pending).toBe(1);
    expect(component.taskStats.completed).toBe(1);
    expect(component.getCategoryName('cat-1')).toBe('Trabajo');
    expect(component.getCategoryColor('cat-1')).toBe('#ffc409');
  });

  it('envía una nueva tarea al servicio y limpia el formulario', async () => {
    component.newTaskTitle = '  Comprar leche  ';
    component.newTaskDescription = '  en la noche  ';
    component.newTaskCategoryId = 'cat-1';

    await component.confirmAdd();

    expect(taskServiceMock.addTask).toHaveBeenCalledWith('  Comprar leche  ', '  en la noche  ', 'cat-1');
    expect(component.isAddModalOpen).toBeFalse();
    expect(component.newTaskTitle).toBe('');
    expect(component.newTaskDescription).toBe('');
    expect(component.newTaskCategoryId).toBe('');
  });
});
