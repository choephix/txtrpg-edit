import { NgModule } from '@angular/core'
import { RouterModule, Routes, ActivatedRoute } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker'
import { AgGridModule } from 'ag-grid-angular'
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment'

import { WorldMapWrapper } from './util/world-map-wrapper'

import { AppComponent } from './app.component'
import { Page404Component } from './app-404.component'
import { EditorVewComponent } from './editor-view/editor-view.component'
import { EditorViewChild_NodesTable } from './editor-view/editor-view.component'
import { EditorViewChild_NodeLinksTable } from './editor-view/editor-view.component'
import { EditorViewChild_FullJson } from './editor-view/editor-view.component'
import { EditorViewChild_Map } from './editor-view/editor-view-map.component'
import { AutomodiPanelComponent } from './editor-view/editor-view.component'

const appRoutes: Routes = [
  { path: ':branch', component: EditorVewComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: EditorViewChild_Map },
          { path: 'fulljson', component: EditorViewChild_FullJson },
          { path: 'nodes', component: EditorViewChild_NodesTable },
          { path: 'text/node_links', component: EditorViewChild_NodeLinksTable },
        ]
  },
  { path: '', redirectTo: 'develop', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    EditorVewComponent,
    	EditorViewChild_NodesTable,
    	EditorViewChild_NodeLinksTable,
    	EditorViewChild_FullJson,
    	EditorViewChild_Map,
    AutomodiPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({easeTime:150}), 
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot( appRoutes, { enableTracing: false } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
