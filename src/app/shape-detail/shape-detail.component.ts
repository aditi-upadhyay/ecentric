import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { configurePbrRenderer } from '../shapes/pbr-scene.setup';
import { createFresnelMesh, disposeMesh } from '../shapes/shape-mesh.factory';
import { getShapeById, ShapeDefinition } from '../shapes/shape.models';

declare const window: Window & { devicePixelRatio: number };

@Component({
  selector: 'app-shape-detail',
  templateUrl: './shape-detail.component.html',
  styleUrls: ['./shape-detail.component.scss'],
})
export class ShapeDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;

  shapeLabel = '';
  edgeColorHex = '#0000ff';
  fresnelStrength = 0.5;
  edgeAttenuation = 2.0;
  steepness = 0.5;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private mesh: THREE.Mesh | null = null;
  private fresnelMaterial: THREE.ShaderMaterial | null = null;
  private animationId = 0;
  private readonly onResize = () => this.handleResize();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    const shapeId = this.route.snapshot.paramMap.get('id');
    const shape = shapeId ? getShapeById(shapeId) : undefined;

    if (!shape) {
      this.router.navigate(['/']);
      return;
    }

    this.shapeLabel = shape.label;
    this.initControlState(shape);
    this.initScene();
    this.createShape(shape);
    this.handleResize();
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.controls?.dispose();
    if (this.mesh) {
      disposeMesh(this.mesh);
    }
    this.renderer?.dispose();
  }

  onEdgeColorChange(hex: string): void {
    this.fresnelMaterial?.uniforms['edgeColor'].value.set(hex);
  }

  onFresnelStrengthChange(value: number): void {
    if (this.fresnelMaterial) {
      this.fresnelMaterial.uniforms['fresnelStrength'].value = value;
    }
  }

  onEdgeAttenuationChange(value: number): void {
    if (this.fresnelMaterial) {
      this.fresnelMaterial.uniforms['edgeAttenuation'].value = value;
    }
  }

  onSteepnessChange(value: number): void {
    if (this.fresnelMaterial) {
      this.fresnelMaterial.uniforms['steepness'].value = value;
    }
  }

  private initControlState(shape: ShapeDefinition): void {
    this.edgeColorHex = new THREE.Color(shape.edgeColor).getStyle();
    this.fresnelStrength = shape.fresnelStrength;
    this.edgeAttenuation = shape.edgeAttenuation;
    this.steepness = shape.steepness;
  }

  private initScene(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 1.5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    configurePbrRenderer(this.renderer);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
  }

  private createShape(shape: ShapeDefinition): void {
    this.mesh = createFresnelMesh(
      shape.createGeometry(),
      shape,
      new THREE.Vector3(0, 0, 0),
    );
    this.fresnelMaterial = this.mesh.userData['fresnelMaterial'] as THREE.ShaderMaterial;
    this.scene.add(this.mesh);
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
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
