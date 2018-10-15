import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { environment } from '../environments/environment'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AgGridModule } from 'ag-grid-angular'

import { WorldMapData } from './editor-view/editor-view.component'
import { AppComponent } from './app.component'
import { GameViewComponent } from './game-view/game-view.component'
import { EditorVewComponent } from './editor-view/editor-view.component'
import { EditorViewChild_NodesTable } from './editor-view/editor-view.component'
import { EditorViewChild_NodeLinksTable } from './editor-view/editor-view.component'
import { EditorViewChild_Map } from './editor-view/editor-view-map.component'

const appRoutes: Routes = [
  { path: 'edit', component: EditorVewComponent,
	  children: [
          { path: '', redirectTo: 'nodes', pathMatch: 'full' },
          { path: 'nodes', component: EditorViewChild_NodesTable },
          { path: 'text/node_links', component: EditorViewChild_NodeLinksTable },
          { path: 'map', component: EditorViewChild_Map }
        ]
  },
  { path: '', component: GameViewComponent },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    EditorVewComponent,
    	EditorViewChild_NodesTable,
    	EditorViewChild_NodeLinksTable,
    	EditorViewChild_Map,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot( appRoutes, { enableTracing: false } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
