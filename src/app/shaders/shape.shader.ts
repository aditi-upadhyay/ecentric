import * as THREE from 'three';

export interface FresnelOptions {
  baseColor: THREE.ColorRepresentation;
  edgeColor: THREE.ColorRepresentation;
  fresnelStrength: number;
  edgeAttenuation: number;
  steepness: number;
}

const vertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 baseColor;
uniform vec3 edgeColor;
uniform float fresnelStrength;
uniform float edgeAttenuation;
uniform float steepness;

varying vec3 vNormal;
varying vec3 vWorldPosition;

// Sigmoid/S-curve remapping for smoother, more natural color falloff
float sigmoidInterp(float t, float k) {
  t = clamp(t, 0.0, 1.0);
  float steep = max(k, 0.01) * 10.0;
  return 1.0 / (1.0 + exp(-steep * (t - 0.5)));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  float fresnel = pow(1.0 - dot(viewDir, normal), edgeAttenuation);
  fresnel = pow(fresnel, steepness);

  float rimBlend = clamp(fresnel * fresnelStrength, 0.0, 1.0);
  float sigmoidBlend = sigmoidInterp(rimBlend, steepness);
  vec3 finalColor = mix(baseColor, edgeColor, sigmoidBlend);

  gl_FragColor = vec4(finalColor, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function createFresnelShaderMaterial(options: FresnelOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(options.baseColor) },
      edgeColor: { value: new THREE.Color(options.edgeColor) },
      fresnelStrength: { value: options.fresnelStrength },
      edgeAttenuation: { value: options.edgeAttenuation },
      steepness: { value: options.steepness },
    },
    vertexShader,
    fragmentShader,
  });
}
