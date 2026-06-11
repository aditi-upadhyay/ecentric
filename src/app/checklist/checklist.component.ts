import { Component, Input } from '@angular/core';

export interface TodoTask {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {
  @Input() title: string = 'Studio To-Do';
  @Input() tasks: TodoTask[] = [];
}
