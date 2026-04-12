import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
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
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

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
  isFabVisible = true;
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
        this.categoryMap = new Map(categories.map(c => [c.id, c]));
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSlideOpen(): void {
    this.isFabVisible = false;
    this.cdr.markForCheck();
  }

  onSlideClose(): void {
    this.isFabVisible = true;
    this.cdr.markForCheck();
  }

  trackByTaskId(_index: number, task: Task): string { return task.id; }
  trackByCategoryId(_index: number, category: Category): string { return category.id; }

  openAddModal(): void { this.isAddModalOpen = true; }

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

  onCategoryChange(): void { this.applyFilters(); }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskCategoryId = '';
  }

  async toggleTask(task: Task): Promise<void> { await this.taskService.toggleTask(task.id); }
  async deleteTask(task: Task): Promise<void> {
    await this.taskService.deleteTask(task.id);
    this.isFabVisible = true;
    this.cdr.markForCheck();
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return 'medium';
    return this.categoryMap.get(categoryId)?.color ?? 'medium';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    return this.categoryMap.get(categoryId)?.name ?? 'Desconocida';
  }

  get currentDateDisplay(): string {
    return new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private applyFilters(): void {
    this.filteredTasks = this.selectedCategoryId === 'all'
      ? this.tasks
      : this.tasks.filter(t => t.categoryId === this.selectedCategoryId);

    const completed = this.filteredTasks.filter(t => t.completed).length;
    this.taskStats = { total: this.filteredTasks.length, completed, pending: this.filteredTasks.length - completed };
    this.cdr.markForCheck();
  }
}