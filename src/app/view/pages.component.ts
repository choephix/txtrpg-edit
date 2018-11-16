import { Component, ViewChild } from '@angular/core';
import { GotoActionsPaneComponent } from '../panes/goto-texts-pane.component';
import { SelectionService } from '../services/selection.service';

@Component({
  template: `
  <two-pane-view>
    <goto-texts-pane pane-left>
    </goto-texts-pane>
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
    <goto-texts-pane pane-right>
    </goto-texts-pane>
  </two-pane-view>
  `
})
export class LocationsMapPage{}

@Component({
  template: `<ace-pane></ace-pane>`
})
export class FullJsonAcePageComponent{}
