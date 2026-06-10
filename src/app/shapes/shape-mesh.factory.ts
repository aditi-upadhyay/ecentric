import * as THREE from 'three';
import { shapeFragmentShader, shapeVertexShader } from '../shaders/shape.shader';

export function createShaderMesh(
  geometry: THREE.BufferGeometry,
  color: THREE.ColorRepresentation,
  position: THREE.Vector3,
): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    vertexShader: shapeVertexShader,
    fragmentShader: shapeFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  return mesh;
}

export function disposeMesh(mesh: THREE.Mesh): void {
  mesh.geometry.dispose();
  (mesh.material as THREE.ShaderMaterial).dispose();
}
