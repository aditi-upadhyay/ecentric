import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapeDetailComponent } from './shape-detail/shape-detail.component';
import { ShapesSceneComponent } from './shapes-scene/shapes-scene.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProjectIntentComponent } from './project-intent/project-intent.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ObservationComponent } from './observation/observation.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';

@NgModule({
  declarations: [
    AppComponent,
    ShapesSceneComponent,
    ShapeDetailComponent,
    ProjectIntentComponent,
    ChecklistComponent,
    ObservationComponent,
    ProfileCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
