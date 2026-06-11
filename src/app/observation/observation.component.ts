import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.scss']
})
export class ObservationComponent {
  @Input() title: string = 'Observations';
}
