import * as THREE from 'three';

export type ShapeId = 'sphere' | 'cube' | 'cone' | 'torus';

export interface ShapeDefinition {
  id: ShapeId;
  label: string;
  color: THREE.ColorRepresentation;
  metalness: number;
  roughness: number;
  edgeColor: THREE.ColorRepresentation;
  fresnelPower: number;
  fresnelIntensity: number;
  position: THREE.Vector3;
  createGeometry: () => THREE.BufferGeometry;
}

export const SHAPES: ShapeDefinition[] = [
  {
    id: 'sphere',
    label: 'Sphere',
    color: '#cb8ead',
    metalness: 0.15,
    roughness: 0.25,
    edgeColor: '#6ee7f0',
    fresnelPower: 3.5,
    fresnelIntensity: 0.9,
    position: new THREE.Vector3(-4.5, 0, 0),
    createGeometry: () => new THREE.SphereGeometry(0.8, 32, 32),
  },
  {
    id: 'cube',
    label: 'Cube',
    color: '#dadea3',
    metalness: 0.1,
    roughness: 0.35,
    edgeColor: '#7c3aed',
    fresnelPower: 3.0,
    fresnelIntensity: 0.85,
    position: new THREE.Vector3(-1.5, 0, 0),
    createGeometry: () => new THREE.BoxGeometry(1.2, 1.2, 1.2),
  },
  {
    id: 'cone',
    label: 'Cone',
    color: '#a5685b',
    metalness: 0.12,
    roughness: 0.3,
    edgeColor: '#fbbf24',
    fresnelPower: 3.0,
    fresnelIntensity: 0.85,
    position: new THREE.Vector3(1.5, 0, 0),
    createGeometry: () => new THREE.ConeGeometry(0.8, 1.5, 32),
  },
  {
    id: 'torus',
    label: 'Donut',
    color: '#f472b6',
    metalness: 0.2,
    roughness: 0.28,
    edgeColor: '#34d399',
    fresnelPower: 3.0,
    fresnelIntensity: 0.85,
    position: new THREE.Vector3(4.5, 0, 0),
    createGeometry: () => new THREE.TorusGeometry(0.7, 0.3, 32, 64),
  },
];

export function getShapeById(id: string): ShapeDefinition | undefined {
  return SHAPES.find((shape) => shape.id === id);
}
