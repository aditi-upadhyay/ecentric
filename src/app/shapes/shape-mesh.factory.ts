import * as THREE from 'three';
import { applyFresnelToPhysicalMaterial } from '../shaders/shape.shader';
import { ShapeDefinition } from './shape.models';

export function createPbrMesh(
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

  applyFresnelToPhysicalMaterial(material, {
    edgeColor: shape.edgeColor,
    fresnelPower: shape.fresnelPower,
    fresnelIntensity: shape.fresnelIntensity,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  return mesh;
}

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.geometry.dispose();
  (mesh.material as THREE.MeshPhysicalMaterial).dispose();
}
