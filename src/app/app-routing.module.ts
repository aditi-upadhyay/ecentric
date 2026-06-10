import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShapesSceneComponent } from './shapes-scene/shapes-scene.component';

const routes: Routes = [
  { path: '', component: ShapesSceneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
