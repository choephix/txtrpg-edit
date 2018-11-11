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
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

import { AppComponent, AppInnerComponent } from './app.component'
import { Page404Component } from './404.component'
import { EditorViewChild_AGGrid } from './view/other-views'
import { EditorViewChild_Words } from './view/words-view.component'
import { EditorViewChild_FullJsonAce } from './view/json-ace.view.component'
import { EditorViewChild_Map } from './view/map-view.component'

import { AutomodiPanelComponent } from './view-sidebar/automodi.panel.component'
import { JsonAcePanelComponent } from './view-sidebar/json-ace.panel.component';
import { MouseWheelDirective } from './util/mouse-wheel.directive';
import { SidebarComponent } from './view-sidebar/sidebar.component';
import { CollapsableComponent } from './common/collapsable.component';
import { SequenceTreeViewComponent } from './view/sequence-tree-view.component';
import { JournalHelperPaneComponent } from './lists/journal-helper-pane.component';

const appRoutes: Routes = [
  { path: ':branch', component: AppInnerComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: EditorViewChild_Map },
          { path: 'words', component: EditorViewChild_Words },
          { path: 'convos', component: SequenceTreeViewComponent },
          { path: 'fulljson_ace', component: EditorViewChild_FullJsonAce },
          { path: 'aggrid', component: EditorViewChild_AGGrid },
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
  	EditorViewChild_AGGrid,
  	EditorViewChild_Words,
  	EditorViewChild_FullJsonAce,
  	EditorViewChild_Map,
    AutomodiPanelComponent,
    JsonAcePanelComponent,
    MouseWheelDirective,
    SidebarComponent,
    CollapsableComponent,
    SequenceTreeViewComponent,
    JournalHelperPaneComponent,
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
    TextareaAutosizeModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SequenceTreeViewComponent]
})
export class AppModule { }
