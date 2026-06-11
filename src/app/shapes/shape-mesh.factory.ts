import * as THREE from 'three';
import { createFresnelShaderMaterial } from '../shaders/shape.shader';
import { ShapeDefinition } from './shape.models';

export function createGalleryMesh(
  geometry: THREE.BufferGeometry,
  shape: ShapeDefinition,
  position: THREE.Vector3,
  envMap: THREE.Texture,
): THREE.Mesh {
  const material = new THREE.MeshPhysicalMaterial({
    color: shape.color,
    metalness: shape.metalness,
    roughness: shape.roughness,
    envMap,
    envMapIntensity: 1.0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  return mesh;
}

export function createFresnelMesh(
  geometry: THREE.BufferGeometry,
  shape: ShapeDefinition,
  position: THREE.Vector3,
): THREE.Mesh {
  const material = createFresnelShaderMaterial({
    baseColor: shape.color,
    edgeColor: shape.edgeColor,
    fresnelStrength: shape.fresnelStrength,
    edgeAttenuation: shape.edgeAttenuation,
    steepness: shape.steepness,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.userData['fresnelMaterial'] = material;
  return mesh;
}

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.geometry.dispose();
  (mesh.material as THREE.Material).dispose();
}
