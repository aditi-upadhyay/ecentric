import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShapeDetailComponent } from './shape-detail/shape-detail.component';
import { ShapesSceneComponent } from './shapes-scene/shapes-scene.component';

const routes: Routes = [
  { path: '', component: ShapesSceneComponent },
  { path: 'shape/:id', component: ShapeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
