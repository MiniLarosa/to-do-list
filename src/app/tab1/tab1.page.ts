import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, Category } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { FirebaseRemoteConfigService } from '../services/firebase-remote-config.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab1Page implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  public remoteConfigService = inject(FirebaseRemoteConfigService);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  taskStats = { total: 0, pending: 0, completed: 0 };
  private categoryMap = new Map<string, Category>();
  private destroy$ = new Subject<void>();

  selectedCategoryId: string = 'all';

  isAddModalOpen = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskCategoryId = '';

  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilters();
      });

    this.taskService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
        this.categoryMap = new Map(categories.map(category => [category.id, category]));
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  trackByCategoryId(_index: number, category: Category): string {
    return category.id;
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  cancelAdd(): void {
    this.isAddModalOpen = false;
    this.resetForm();
  }

  confirmAdd(): void {
    if (this.newTaskTitle.trim()) {
      const catId = this.newTaskCategoryId ? this.newTaskCategoryId : undefined;
      this.taskService.addTask(this.newTaskTitle, this.newTaskDescription, catId);
      this.isAddModalOpen = false;
      this.resetForm();
    }
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskCategoryId = '';
  }

  async toggleTask(task: Task): Promise<void> {
    await this.taskService.toggleTask(task.id);
  }

  async deleteTask(task: Task): Promise<void> {
    await this.taskService.deleteTask(task.id);
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return 'medium';
    const cat = this.categoryMap.get(categoryId);
    return cat ? cat.color : 'medium';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    const cat = this.categoryMap.get(categoryId);
    return cat ? cat.name : 'Desconocida';
  }

  private applyFilters(): void {
    this.filteredTasks = this.selectedCategoryId === 'all'
      ? this.tasks
      : this.tasks.filter(task => task.categoryId === this.selectedCategoryId);

    const completed = this.filteredTasks.filter(task => task.completed).length;
    this.taskStats = {
      total: this.filteredTasks.length,
      completed,
      pending: this.filteredTasks.length - completed
    };

    this.cdr.markForCheck();
  }
}
