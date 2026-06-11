import { Component, Input } from '@angular/core';

export interface ListSection {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-project-intent',
  templateUrl: './project-intent.component.html',
  styleUrls: ['./project-intent.component.scss']
})
export class ProjectIntentComponent {
  @Input() title: string = 'Project Intent';
  @Input() quote: string = '';
  @Input() listSections: ListSection[] = [];
}
