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
      title: 'Fresnel Effect Settings',
      items: [
        'Fresnel Model: View-dependent reflectance (dot(N, V))',
        'Edge Attenuation: Controls falloff from edge to center',
        'Steepness: Controls sharpness of transition curve',
        'Edge Tint: User-defined rim color (RGB controlled)',
      ]
    },
    {
      title: 'STUDIO CONFIGURATION',
      items: [
        'Shape: Sphere, Cube, Torus, Cone',
        'Color: RGB controlled',
        'Metalness: 0.15-0.25',
        'Roughness: 0.25-0.35',
        'Edge Color: RGB controlled',
        'Edge Attenuation: 2.0',
        'Fresnel Strength: 0.5',
        'Steepness: 0.5',
      ]
    }
  ];

  todoTitle = 'Assignment Checklist';
  todoTasks: TodoTask[] = [
    { title: 'Apply Fresnel effect using custom shader', completed: true },
    { title: 'Implement edge color control (color picker)', completed: true },
    { title: 'Implement edge attenuation (falloff control)', completed: true },
    { title: "Add steepness control (transition sharpness)", completed: true },
    { title: "Ensure real-time UI interaction", completed: true },
    { title: "Support multiple geometries (sphere, cube, torus, cone)", completed: true },
    { title: "Polish visual output (color blending / mix fix)", completed: true },
    { title: "Finalize clean UI layout & labeling", completed: true },
  ];
}
