import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes, ActivatedRoute } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AgGridModule } from 'ag-grid-angular'

import { WorldMapData } from './editor-view/editor-view.component'
import { Gitbub } from './util/gitbub'
import { GitbubAutomodi, GitbubAutomodiGo } from './util/gitbub-automodi'

import { AppComponent, Page404Component } from './app.component'
import { GameViewComponent } from './game-view/game-view.component'
import { EditorVewComponent } from './editor-view/editor-view.component'
import { EditorViewChild_NodesTable } from './editor-view/editor-view.component'
import { EditorViewChild_NodeLinksTable } from './editor-view/editor-view.component'
import { EditorViewChild_Map } from './editor-view/editor-view-map.component'

const appRoutes: Routes = [
  { path: ':branch/edit', component: EditorVewComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: EditorViewChild_Map },
          { path: 'nodes', component: EditorViewChild_NodesTable },
          { path: 'text/node_links', component: EditorViewChild_NodeLinksTable },
        ]
  },
  { path: ':branch/game', component: GameViewComponent },
  { path: ':branch', redirectTo: ':branch/game', pathMatch: 'full' },
  { path: '', redirectTo: 'develop/game', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    GameViewComponent,
    EditorVewComponent,
    	EditorViewChild_NodesTable,
    	EditorViewChild_NodeLinksTable,
    	EditorViewChild_Map,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot( appRoutes, { enableTracing: false } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
