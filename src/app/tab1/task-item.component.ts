import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Input({ required: true }) categoryName = '';
  @Input({ required: true }) categoryColor = '#666666';

  @Output() toggleTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
}
