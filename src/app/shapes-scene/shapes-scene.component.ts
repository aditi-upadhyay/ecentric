import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { shapeFragmentShader, shapeVertexShader } from '../shaders/shape.shader';
declare var window: any;
interface ShapeConfig {
  geometry: THREE.BufferGeometry;
  color: THREE.ColorRepresentation;
  position: THREE.Vector3;
}

@Component({
  selector: 'app-shapes-scene',
  templateUrl: './shapes-scene.component.html',
  styleUrls: ['./shapes-scene.component.scss'],
})
export class ShapesSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private meshes: THREE.Mesh[] = [];
  private animationId = 0;
  /** Seconds elapsed since the render loop started; passed to shader `uTime` for animation. */
  private elapsedTime = 0;
  private readonly onResize = () => this.handleResize();

  constructor() {
    // Expose instance on window for debugging in the browser console.
    window.obj = this;
  }

  // ViewChild is available here — WebGL needs the container element in the DOM.
  ngAfterViewInit(): void {
    this.initScene();
    this.createShapes();
    this.handleResize();
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  // WebGL geometries, materials, and the renderer hold GPU memory; dispose explicitly.
  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.controls?.dispose();
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.ShaderMaterial).dispose();
    });
    this.renderer?.dispose();
  }

  private initScene(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 2, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // Render at native resolution on Retina / high-DPI displays.
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Damping adds inertia; controls.update() must run every frame (see animate).
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
  }

  private createShapes(): void {
    const shapes: ShapeConfig[] = [
      {
        geometry: new THREE.SphereGeometry(0.8, 32, 32),
        color: '#cb8ead',
        position: new THREE.Vector3(-4.5, 0, 0),
      },
      {
        geometry: new THREE.BoxGeometry(1.2, 1.2, 1.2),
        color: "#dadea3",
        position: new THREE.Vector3(-1.5, 0, 0),
      },
      {
        geometry: new THREE.ConeGeometry(0.8, 1.5, 32),
        color: "#a5685b",
        position: new THREE.Vector3(1.5, 0, 0),
      },
      {
        geometry: new THREE.TorusGeometry(0.7, 0.3, 32, 64),
        color: '#f472b6',
        position: new THREE.Vector3(4.5, 0, 0),
      },
    ];

    shapes.forEach((config) => {
      const mesh = this.createShaderMesh(
        config.geometry,
        config.color,
        config.position,
      );
      this.scene.add(mesh);
      this.meshes.push(mesh);
    });
  }

  private createShaderMesh(
    geometry: THREE.BufferGeometry,
    color: THREE.ColorRepresentation,
    position: THREE.Vector3,
  ): THREE.Mesh {
    // Uniforms are read in shape.shader.ts (fresnel rim + time-based pulse).
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

  private handleResize(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // ~16 ms per frame (60 fps). Drives `sin(uTime)` pulse in the fragment shader.
    this.elapsedTime += 0.016;
    this.meshes.forEach((mesh) => {
      (mesh.material as THREE.ShaderMaterial).uniforms['uTime'].value =
        this.elapsedTime;
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
