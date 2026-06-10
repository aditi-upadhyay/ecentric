import * as THREE from 'three';

export type ShapeId = 'sphere' | 'cube' | 'cone' | 'torus';

export interface ShapeDefinition {
  id: ShapeId;
  label: string;
  color: THREE.ColorRepresentation;
  position: THREE.Vector3;
  createGeometry: () => THREE.BufferGeometry;
}

export const SHAPES: ShapeDefinition[] = [
  {
    id: 'sphere',
    label: 'Sphere',
    color: '#cb8ead',
    position: new THREE.Vector3(-4.5, 0, 0),
    createGeometry: () => new THREE.SphereGeometry(0.8, 32, 32),
  },
  {
    id: 'cube',
    label: 'Cube',
    color: '#dadea3',
    position: new THREE.Vector3(-1.5, 0, 0),
    createGeometry: () => new THREE.BoxGeometry(1.2, 1.2, 1.2),
  },
  {
    id: 'cone',
    label: 'Cone',
    color: '#a5685b',
    position: new THREE.Vector3(1.5, 0, 0),
    createGeometry: () => new THREE.ConeGeometry(0.8, 1.5, 32),
  },
  {
    id: 'torus',
    label: 'Donut',
    color: '#f472b6',
    position: new THREE.Vector3(4.5, 0, 0),
    createGeometry: () => new THREE.TorusGeometry(0.7, 0.3, 32, 64),
  },
];

export function getShapeById(id: string): ShapeDefinition | undefined {
  return SHAPES.find((shape) => shape.id === id);
}
