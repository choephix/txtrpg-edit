import { environment } from '../environments/environment'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker'
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AceEditorModule } from 'ng2-ace-editor';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

import { AppComponent, AppInnerComponent } from './app.component'
import { Page404Component } from './404.component'
import { LocationsMapPage } from './view/pages.component'
import { GotoTextsPage } from './view/pages.component'
import { SequenceTreesPage } from './view/pages.component'
import { FullJsonAcePageComponent } from './view/pages.component'

import { SidebarComponent } from './view-sidebar/sidebar.component';
import { AutomodiPanelComponent } from './view-sidebar/automodi.panel.component'
import { JsonAcePanelComponent } from './view-sidebar/json-ace.panel.component';

import { MapPaneComponent } from './panes/map-pane.component';
import { GotoActionsPaneComponent } from './panes/goto-actions-pane.component';
import { SequenceTreePaneComponent } from './panes/sequence-tree-pane.component';
import { JournalHelperPaneComponent } from './panes/journal-helper-pane.component';
import { AcePaneComponent } from './panes/ace-pane.component';

import { TwoPaneViewComponent } from './view/two-pane-view.component';
import { CollapsableComponent } from './common/collapsable.component';
import { MouseWheelDirective } from './util/mouse-wheel.directive';
import { NavigashtiService } from './services/navigashti.service';

const appRoutes: Routes = [
  { path: ':branch', component: AppInnerComponent,
	  children: [
          { path: '', redirectTo: 'map', pathMatch: 'full' },
          { path: 'map', component: LocationsMapPage },
          { path: 'goto', component: GotoTextsPage },
          { path: 'convo', component: SequenceTreesPage },
          { path: 'jsonfull', component: FullJsonAcePageComponent },
        ]
  },
  { path: '', redirectTo: 'develop', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [
    AppComponent,
    AppInnerComponent,
    //pages
    Page404Component,
  	LocationsMapPage,
  	GotoTextsPage,
  	SequenceTreesPage,
    FullJsonAcePageComponent,
    //sidebar
    SidebarComponent,
    AutomodiPanelComponent,
    JsonAcePanelComponent,
    //panes
    MapPaneComponent,
    GotoActionsPaneComponent,
    SequenceTreePaneComponent,
    JournalHelperPaneComponent,
    AcePaneComponent,
    //common
    TwoPaneViewComponent,
    CollapsableComponent,
    MouseWheelDirective,
  ],
  imports: [
    RouterModule.forRoot( appRoutes, { enableTracing: false } ),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot({easeTime:150}),
    TextareaAutosizeModule,
    AceEditorModule,
  ],
  exports: [RouterModule],
  providers: [NavigashtiService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
