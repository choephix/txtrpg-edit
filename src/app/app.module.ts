import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GameViewComponent } from './game-view/game-view.component';
import { EditorVewComponent } from './editor-vew/editor-vew.component';

const appRoutes: Routes = [
  { path: 'editor', component: EditorVewComponent },
  { path: '', component: GameViewComponent },
  { path: '**', component: EditorVewComponent }
];

@NgModule({
  declarations: [
    AppComponent, GameViewComponent, EditorVewComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot( appRoutes, { enableTracing: false } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
