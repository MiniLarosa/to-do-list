import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';

import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';
import { TaskService } from '../services/task.service';
import { Category } from '../models/task.model';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  const categoriesSubject = new BehaviorSubject<Category[]>([]);
  const taskServiceMock = {
    categories$: categoriesSubject.asObservable(),
    updateCategory: jasmine.createSpy('updateCategory').and.resolveTo(),
    addCategory: jasmine.createSpy('addCategory').and.resolveTo(),
    deleteCategory: jasmine.createSpy('deleteCategory').and.resolveTo(),
  };

  const remoteConfigServiceMock = {
    showCategoryColors$: new BehaviorSubject(true),
  };

  const alertControllerMock = {
    create: jasmine.createSpy('create'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), ScrollingModule],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: FirebaseRemoteConfigService, useValue: remoteConfigServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('actualiza la lista cuando llegan categorías nuevas', () => {
    categoriesSubject.next([
      { id: 'cat-1', name: 'Personal', color: '#3880ff', createdAt: new Date(), updatedAt: new Date() },
    ]);

    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Personal');
  });

  it('guarda una categoría nueva con nombre y color', () => {
    component.categoryName = 'Estudio';
    component.categoryColor = '#2dd36f';
    component.saveCategory();

    expect(taskServiceMock.addCategory).toHaveBeenCalledWith('Estudio', '#2dd36f');
    expect(component.isModalOpen).toBeFalse();
  });

  it('abre confirmación antes de borrar una categoría', async () => {
    const presentSpy = jasmine.createSpy('present').and.resolveTo();
    const alertObj = {
      present: presentSpy,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => taskServiceMock.deleteCategory('cat-1')
        }
      ]
    } as any;
    alertControllerMock.create.and.resolveTo(alertObj);

    await component.deleteCategory({ id: 'cat-1', name: 'Trabajo', color: '#ffc409', createdAt: new Date(), updatedAt: new Date() });

    expect(alertControllerMock.create).toHaveBeenCalled();
    expect(presentSpy).toHaveBeenCalled();
    alertObj.buttons[1].handler();
    expect(taskServiceMock.deleteCategory).toHaveBeenCalledWith('cat-1');
  });
});
