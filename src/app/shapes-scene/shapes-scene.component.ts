import { Component } from '@angular/core';
import { SHAPES, ShapeDefinition } from '../shapes/shape.models';
import { ListSection } from '../project-intent/project-intent.component';
import { TodoTask } from '../checklist/checklist.component';

@Component({
  selector: 'app-shapes-scene',
  templateUrl: './shapes-scene.component.html',
  styleUrls: ['./shapes-scene.component.scss'],
})
export class ShapesSceneComponent {
  readonly shapes: ShapeDefinition[] = SHAPES;

  projectIntentTitle = 'Project Intent';
  projectIntentQuote = '"Create an interactive 3D scene featuring a Fresnel effect applied to a PBR (Physically Based Rendering) material on a sphere. The effect should be controllable through an interactive UI."';
  projectIntentSections: ListSection[] = [
    {
      title: 'OPTICAL PROPERTIES',
      items: [
        'Index of Refraction: 1.45 (Standard Glass)',
        'Edge Attenuation: Non-linear decay (0.82)',
        'Chromatic Aberration: Subtle fringe (+0.02)'
      ]
    },
    {
      title: 'STUDIO CONFIGURATION',
      items: [
        "Environment Map: 'Nordic_Studio_Day'",
        'Sampling: 64spp with Denoise',
        'Render Engine: Fresnel V2.1 Core'
      ]
    }
  ];

  todoTitle = 'Studio To-Do';
  todoTasks: TodoTask[] = [
    { title: 'Calibrate Fresnel Falloff', meta: 'COMPLETED BY ADITI', completed: true },
    { title: 'Optimize Torus Polycount', meta: 'PRIORITY: HIGH', completed: false },
    { title: "New 'Iridescent' Preset", meta: 'R&D PHASE', completed: false },
    { title: 'Export Final GLB Assets', meta: 'PENDING REVIEW', completed: false }
  ];
}
