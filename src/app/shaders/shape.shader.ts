export const shapeVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const shapeFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    float pulse = 0.85 + 0.15 * sin(uTime * 2.0);
    vec3 baseColor = uColor * pulse;
    vec3 rimColor = vec3(1.0);
    vec3 finalColor = mix(baseColor, rimColor, fresnel * 0.6);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
