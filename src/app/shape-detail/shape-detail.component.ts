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
import { createShaderMesh, disposeMesh } from '../shapes/shape-mesh.factory';
import { getShapeById } from '../shapes/shape.models';

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

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private mesh: THREE.Mesh | null = null;
  private animationId = 0;
  private elapsedTime = 0;
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

  private initScene(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 1.5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
  }

  private createShape(shape: ReturnType<typeof getShapeById>): void {
    if (!shape) {
      return;
    }

    this.mesh = createShaderMesh(
      shape.createGeometry(),
      shape.color,
      new THREE.Vector3(0, 0, 0),
    );
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

    this.elapsedTime += 0.016;
    if (this.mesh) {
      (this.mesh.material as THREE.ShaderMaterial).uniforms['uTime'].value =
        this.elapsedTime;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
