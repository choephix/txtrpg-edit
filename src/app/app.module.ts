import { environment } from '../environments/environment'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker'
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular'
import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent, AppInnerComponent } from './app.component'
import { Page404Component } from './404.component'
import { EditorViewChild_NodesTable } from './view/other.component'
import { EditorViewChild_NodeLinksTable } from './view/other.component'
import { EditorViewChild_FullJson } from './view/other.component'
import { EditorViewChild_FullJsonAce } from './view/other.component'
import { EditorViewChild_Map } from './view/map.component'

import { AutomodiPanelComponent } from './view-sidebar/automodi.panel.component'
import { JsonAcePanelComponent } from './view-sidebar/json-ace.panel.component';
import { MouseWheelDirective } from './util/mouse-wheel.directive'

const appRoutes: Routes = [
  { path: ':branch', component: AppInnerComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: EditorViewChild_Map },
          { path: 'fulljson', component: EditorViewChild_FullJson },
          { path: 'fulljson_ace', component: EditorViewChild_FullJsonAce },
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
    AppInnerComponent,
    Page404Component,
  	EditorViewChild_NodesTable,
  	EditorViewChild_NodeLinksTable,
  	EditorViewChild_FullJson,
  	EditorViewChild_FullJsonAce,
  	EditorViewChild_Map,
    AutomodiPanelComponent,
    JsonAcePanelComponent,
    MouseWheelDirective,
  ],
  imports: [
    RouterModule.forRoot( appRoutes, { enableTracing: false } ),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ToastrModule.forRoot({easeTime:150}),
    AgGridModule.withComponents([]),
    AceEditorModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
