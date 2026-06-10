import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createShaderMesh, disposeMesh } from '../shapes/shape-mesh.factory';
import { SHAPES, ShapeId } from '../shapes/shape.models';


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
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private animationId = 0;
  private pointerDownX = 0;
  private pointerDownY = 0;
  private readonly onResize = () => this.handleResize();
  private readonly onPointerDown = (event: PointerEvent) => {
    this.pointerDownX = event.clientX;
    this.pointerDownY = event.clientY;
  };
  private readonly onPointerUp = (event: PointerEvent) => this.handleClick(event);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initScene();
    this.createShapes();
    this.handleResize();
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer?.domElement.removeEventListener('pointerup', this.onPointerUp);
    this.controls?.dispose();
    this.meshes.forEach((mesh) => disposeMesh(mesh));
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
    SHAPES.forEach((shape) => {
      const mesh = createShaderMesh(
        shape.createGeometry(),
        shape.color,
        shape.position,
      );
      mesh.userData['shapeId'] = shape.id;
      this.scene.add(mesh);
      this.meshes.push(mesh);
    });
  }

  private handleClick(event: PointerEvent): void {
    const dx = event.clientX - this.pointerDownX;
    const dy = event.clientY - this.pointerDownY;

    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      return;
    }

    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.meshes);

    if (hits.length === 0) {
      return;
    }

    const shapeId = hits[0].object.userData['shapeId'] as ShapeId | undefined;
    if (shapeId) {
      this.router.navigate(['/shape', shapeId]);
    }
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
