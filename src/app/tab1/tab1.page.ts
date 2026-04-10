import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private alertCtrl = inject(AlertController);

  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => (this.tasks = tasks));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  async openAddTaskDialog(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea...',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.title?.trim()) {
              this.taskService.addTask(data.title, data.description);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async toggleTask(task: Task): Promise<void> {
    await this.taskService.toggleTask(task.id);
  }

  async deleteTask(task: Task): Promise<void> {
    await this.taskService.deleteTask(task.id);
  }

  get pendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }
}
