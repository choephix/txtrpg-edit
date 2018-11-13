import { Component, ViewChild } from '@angular/core';
import { GotoActionsPaneComponent } from '../panes/goto-actions-pane.component';
import { SelectionService } from '../services/selection.service';

@Component({
  template: `
  <two-pane-view>
    <goto-actions-pane pane-left>
    </goto-actions-pane>
    <journal-helper-pane pane-right>
    </journal-helper-pane>
  </two-pane-view>
  `
})
export class GotoTextsPage {}

@Component({
  template: `
  <two-pane-view>
    <sequence-tree-pane pane-left>
    </sequence-tree-pane>
    <journal-helper-pane pane-right>
    </journal-helper-pane>
  </two-pane-view>
  `
})
export class SequenceTreesPage {}

@Component({
  template: `
  <style type="scss/text">
  :host(.pane) { overflow: hidden !important; }
  .pane.right { border-left: #222 1px solid !important; }
  </style>
  <two-pane-view>
    <map-pane pane-left>
    </map-pane>
    <goto-actions-pane pane-right>
    </goto-actions-pane>
  </two-pane-view>
  `
})
export class LocationsMapPage
{
  @ViewChild(GotoActionsPaneComponent) gotoList:GotoActionsPaneComponent;
  constructor( private selection:SelectionService )
  {
    selection.callbacks_OnSelect.push( o => {
      if ( o["x"] != undefined )
        this.gotoList.filter.from = o?o.uid:""
    } )
  }
}
