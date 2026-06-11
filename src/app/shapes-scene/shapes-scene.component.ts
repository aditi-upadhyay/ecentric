import { Component } from '@angular/core';
import { SHAPES, ShapeDefinition } from '../shapes/shape.models';

@Component({
  selector: 'app-shapes-scene',
  templateUrl: './shapes-scene.component.html',
  styleUrls: ['./shapes-scene.component.scss'],
})
export class ShapesSceneComponent {
  readonly shapes: ShapeDefinition[] = SHAPES;
}
