import * as THREE from 'three';

export interface FresnelOptions {
  edgeColor: THREE.ColorRepresentation;
  fresnelPower: number;
  fresnelIntensity: number;
}

export function applyFresnelToPhysicalMaterial(
  material: THREE.MeshPhysicalMaterial,
  options: FresnelOptions,
): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms['uEdgeColor'] = { value: new THREE.Color(options.edgeColor) };
    shader.uniforms['uFresnelPower'] = { value: options.fresnelPower };
    shader.uniforms['uFresnelIntensity'] = { value: options.fresnelIntensity };

    shader.fragmentShader = `
      uniform vec3 uEdgeColor;
      uniform float uFresnelPower;
      uniform float uFresnelIntensity;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `
        float fresnel = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), uFresnelPower);
        outgoingLight = mix(outgoingLight, uEdgeColor, fresnel * uFresnelIntensity);
        #include <output_fragment>
      `,
    );
  };
}
