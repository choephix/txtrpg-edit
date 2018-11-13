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
import { LocationsMapPage } from './view/pages.component'
import { GotoTextsPage } from './view/pages.component'
import { SequenceTreesPage } from './view/pages.component'
  import { EditorViewChild_FullJsonAce } from './view/json-ace.view.component'

import { MouseWheelDirective } from './util/mouse-wheel.directive';
import { AutomodiPanelComponent } from './view-sidebar/automodi.panel.component'
import { JsonAcePanelComponent } from './view-sidebar/json-ace.panel.component';
import { SidebarComponent } from './view-sidebar/sidebar.component';
import { CollapsableComponent } from './common/collapsable.component';
import { TwoPaneViewComponent } from './view/two-pane-view.component';

import { JournalHelperPaneComponent } from './panes/journal-helper-pane.component';
import { GotoActionsPaneComponent } from './panes/goto-actions-pane.component';
import { SequenceTreePaneComponent } from './panes/sequence-tree-pane.component';
import { MapPaneComponent } from './panes/map-pane.component';

const appRoutes: Routes = [
  { path: ':branch', component: AppInnerComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: LocationsMapPage },
          { path: 'goto', component: GotoTextsPage },
          { path: 'convo', component: SequenceTreesPage },
          { path: 'jsonfull', component: EditorViewChild_FullJsonAce },
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
  	LocationsMapPage,
  	GotoTextsPage,
  	SequenceTreesPage,
  	EditorViewChild_FullJsonAce,
    AutomodiPanelComponent,
    JsonAcePanelComponent,
    MouseWheelDirective,
    SidebarComponent,
    CollapsableComponent,
    TwoPaneViewComponent,
    JournalHelperPaneComponent,
    GotoActionsPaneComponent,
    SequenceTreePaneComponent,
    MapPaneComponent,
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
  entryComponents: []
})
export class AppModule { }
