import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AlertController } from '@ionic/angular';
import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab2Page implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private alertCtrl = inject(AlertController);
  private remoteConfigService = inject(FirebaseRemoteConfigService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  showCategoryColors: boolean = true;

  isModalOpen = false;
  editingCategoryId: string | null = null;
  categoryName = '';
  categoryColor = '#3880ff';

  availableColors = ['#3880ff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409', '#eb445a', '#222428', '#92949c'];

  ngOnInit(): void {
    this.taskService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cats => {
        this.categories = cats;
        this.cdr.markForCheck();
      });

    this.remoteConfigService.showCategoryColors$
      .pipe(takeUntil(this.destroy$))
      .subscribe((show: boolean) => {
        this.showCategoryColors = show;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(category?: Category): void {
    if (category) {
      this.editingCategoryId = category.id;
      this.categoryName = category.name;
      this.categoryColor = category.color;
    } else {
      this.editingCategoryId = null;
      this.categoryName = '';
      this.categoryColor = '#3880ff';
    }
    this.isModalOpen = true;
  }

  cancelModal(): void {
    this.isModalOpen = false;
  }

  saveCategory(): void {
    if (!this.categoryName.trim()) return;

    if (this.editingCategoryId) {
      this.taskService.updateCategory(this.editingCategoryId, this.categoryName, this.categoryColor);
    } else {
      this.taskService.addCategory(this.categoryName, this.categoryColor);
    }
    this.isModalOpen = false;
  }

  async deleteCategory(category: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoría',
      message: `¿Estás seguro de que deseas eliminar "${category.name}"? Sus tareas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteCategory(category.id);
          }
        }
      ]
    });
    await alert.present();
  }

  trackByCategoryId(_index: number, category: Category): string {
    return category.id;
  }
}
