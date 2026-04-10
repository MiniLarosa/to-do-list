import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

const TASKS_KEY = 'todo_tasks';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageService = inject(StorageService);

  private tasksSubject = new BehaviorSubject<Task[]>([]);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  async loadTasks(): Promise<void> {
    const saved = await this.storageService.get(TASKS_KEY);
    this.tasksSubject.next(saved ?? []);
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  async addTask(title: string, description: string = ''): Promise<void> {
    const newTask: Task = {
      id: this.generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
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

  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(TASKS_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
