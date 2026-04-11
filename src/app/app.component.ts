import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from './services/storage.service';
import { TaskService } from './services/task.service';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit {
  private storageService = inject(StorageService);
  private taskService = inject(TaskService);
  private remoteConfigService = inject(FirebaseRemoteConfigService);


  async ngOnInit(): Promise<void> {
    await this.storageService.init();
    await this.taskService.loadCategories();
    await this.taskService.loadTasks();
    setTimeout(() => {
      void this.remoteConfigService.initialize();
    }, 0);
  }
}
