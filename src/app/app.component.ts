import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from './services/storage.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit {
  private storageService = inject(StorageService);
  private taskService = inject(TaskService);


  async ngOnInit(): Promise<void> {
    await this.storageService.init();
    await this.taskService.loadTasks();
  }
}
