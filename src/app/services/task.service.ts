import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Category } from '../models/task.model';
import { StorageService } from './storage.service';

const TASKS_KEY = 'todo_tasks';
const CATEGORIES_KEY = 'todo_categories';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageService = inject(StorageService);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  async loadTasks(): Promise<void> {
    const saved = await this.storageService.get(TASKS_KEY);
    this.tasksSubject.next(saved ?? []);
  }

  async loadCategories(): Promise<void> {
    const saved = await this.storageService.get(CATEGORIES_KEY);
    if (!saved || saved.length === 0) {
      const defaultCategories: Category[] = [
        { id: 'cat-1', name: 'Personal', color: '#3880ff', createdAt: new Date(), updatedAt: new Date() },
        { id: 'cat-2', name: 'Trabajo', color: '#ffc409', createdAt: new Date(), updatedAt: new Date() }
      ];
      await this.saveCategories(defaultCategories);
    } else {
      this.categoriesSubject.next(saved);
    }
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  async addTask(title: string, description: string = '', categoryId?: string): Promise<void> {
    const newTask: Task = {
      id: this.generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = [...this.getTasks(), newTask];
    await this.saveTasks(tasks);
  }

  async toggleTask(id: string): Promise<void> {
    const tasks = this.getTasks().map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    );
    await this.saveTasks(tasks);
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = this.getTasks().filter(task => task.id !== id);
    await this.saveTasks(tasks);
  }

  async addCategory(name: string, color: string): Promise<void> {
    const newCategory: Category = {
      id: this.generateId(),
      name: name.trim(),
      color,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const categories = [...this.getCategories(), newCategory];
    await this.saveCategories(categories);
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = this.getCategories().filter(c => c.id !== id);
    await this.saveCategories(categories);
    const tasks = this.getTasks().map(task =>
      task.categoryId === id ? { ...task, categoryId: undefined } : task
    );
    await this.saveTasks(tasks);
  }

  async updateCategory(id: string, name: string, color: string): Promise<void> {
    const categories = this.getCategories().map(c =>
      c.id === id ? { ...c, name: name.trim(), color, updatedAt: new Date() } : c
    );
    await this.saveCategories(categories);
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(TASKS_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    await this.storageService.set(CATEGORIES_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
