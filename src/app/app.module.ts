import { NgModule } from '@angular/core'
import { RouterModule, Routes, ActivatedRoute } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker'
import { AgGridModule } from 'ag-grid-angular'
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment'

import { WorldMapData } from './editor-view/editor-view.component'
import { Gitbub } from './util/gitbub'
import { GitbubAutomodi, GitbubAutomodiGo } from './util/gitbub-automodi'

import { AppComponent } from './app.component'
import { Page404Component } from './app-404.component'
import { EditorVewComponent } from './editor-view/editor-view.component'
import { EditorViewChild_NodesTable } from './editor-view/editor-view.component'
import { EditorViewChild_NodeLinksTable } from './editor-view/editor-view.component'
import { EditorViewChild_FullJson } from './editor-view/editor-view.component'
import { EditorViewChild_Map } from './editor-view/editor-view-map.component'

const appRoutes: Routes = [
  { path: ':branch/edit', component: EditorVewComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: EditorViewChild_Map },
          { path: 'fulljson', component: EditorViewChild_FullJson },
          { path: 'nodes', component: EditorViewChild_NodesTable },
          { path: 'text/node_links', component: EditorViewChild_NodeLinksTable },
        ]
  },
  { path: ':branch', redirectTo: ':branch/edit', pathMatch: 'full' },
  { path: '', redirectTo: 'develop/edit', pathMatch: 'full' },
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({positionClass:'toast-bottom-right',easeTime:150,timeOut:3300}), 
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot( appRoutes, { enableTracing: false } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
