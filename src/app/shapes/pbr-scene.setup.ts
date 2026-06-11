import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface PbrEnvironment {
  envMap: THREE.Texture;
  pmrem: THREE.PMREMGenerator;
}

export function configurePbrRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

export function createPbrEnvironment(renderer: THREE.WebGLRenderer): PbrEnvironment {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment()).texture;

  return { envMap, pmrem };
}

export function addPbrLights(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 8, 5);
  scene.add(ambient, keyLight);
}

export function disposePbrEnvironment(envMap: THREE.Texture, pmrem: THREE.PMREMGenerator): void {
  envMap.dispose();
  pmrem.dispose();
}
