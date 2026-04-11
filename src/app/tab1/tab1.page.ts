import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
})
export class Tab1Page implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  public remoteConfigService = inject(FirebaseRemoteConfigService);

  tasks: Task[] = [];
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  selectedCategoryId: string = 'all';

  isAddModalOpen = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskCategoryId = '';

  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => (this.tasks = tasks));

    this.taskService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => (this.categories = categories));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  get filteredTasks(): Task[] {
    if (this.selectedCategoryId === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(t => t.categoryId === this.selectedCategoryId);
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

  get pendingCount(): number {
    return this.filteredTasks.filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.filteredTasks.filter(t => t.completed).length;
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return 'medium';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.color : 'medium';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Desconocida';
  }
}
