import { environment } from '../environments/environment'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker'
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AceEditorModule } from 'ng2-ace-editor'

import { AppComponent, AppInnerComponent } from './app.component'
import { Page404Component } from './404.component'
import { LocationsMapPage } from './view/pages.component'
import { GotoTextsPage } from './view/pages.component'
import { SequenceTreesPage } from './view/pages.component'
import { ThreadsPage } from './view/pages.component'
import { FullJsonAcePageComponent } from './view/pages.component'

import { SidebarComponent } from './view-sidebar/sidebar.component'
import { AutomodiPanelComponent } from './view-sidebar/automodi.panel.component'
import { JsonAcePanelComponent } from './view-sidebar/json-ace.panel.component'

import { MapPaneComponent } from './panes/map-pane.component'
import { GotoActionsPaneComponent } from './panes/goto-texts-pane.component'
import { SequenceTreePaneComponent } from './panes/sequence-tree-pane.component'
import { ThreadsPaneComponent } from './panes/threads-pane.component'
import { JournalHelperPaneComponent, LocationsListComponent } from './panes/journal-helper-pane.component'
import { AcePaneComponent } from './panes/ace-pane.component'

import { SequenceTreeListComponent } from './lists/sequence-tree.list.component';

import { TwoPaneViewComponent } from './view/two-pane-view.component'
import { CollapsableComponent } from './common/collapsable.component'
import { JsonAceEditorWrapperComponent } from './common/json-ace-editor.component'
import { AutoresizeDirective } from './common/autoresize.directive'
import { MouseWheelDirective } from './common/mouse-wheel.directive'
import { SelectableDirective } from './common/selectable.directive'

const appRoutes: Routes = [
  { path: ':branch', component: AppInnerComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: LocationsMapPage },
          { path: 'goto', component: GotoTextsPage },
          { path: 'convo', component: SequenceTreesPage },
          { path: 'threads', component: ThreadsPage },
          { path: 'jsonfull', component: FullJsonAcePageComponent },
        ]
  },
  { path: '', redirectTo: 'develop', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    AppComponent,
    AppInnerComponent,
    //pages
    Page404Component,
  	LocationsMapPage,
  	GotoTextsPage,
  	SequenceTreesPage,
  	ThreadsPage,
    FullJsonAcePageComponent,
    //sidebar
    SidebarComponent,
    AutomodiPanelComponent,
    JsonAcePanelComponent,
    //panes
    MapPaneComponent,
    GotoActionsPaneComponent,
    SequenceTreePaneComponent,
    ThreadsPaneComponent,
    JournalHelperPaneComponent,
    LocationsListComponent,
    AcePaneComponent,
    //lists
    SequenceTreeListComponent,
    //common
    TwoPaneViewComponent,
    CollapsableComponent,
    JsonAceEditorWrapperComponent,
    AutoresizeDirective,
    MouseWheelDirective,
    SelectableDirective,
  ],
  imports: [
    RouterModule.forRoot( appRoutes, { enableTracing: false } ),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot({easeTime:150}),
    AceEditorModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {}
