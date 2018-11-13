import { Component, ViewChild } from '@angular/core';
import { GotoActionsPaneComponent } from '../panes/goto-actions-pane.component';
import { SelectionService } from '../services/selection.service';

declare var require: any;

@Component({template: `
<div id="full-page" class="darkform">
  <div class="pane left" style="width: 61.8%;">
    <map-pane></map-pane>
  </div>
  <!-- SPLIT -->
  <div class="pane right" style="width: 38.2%;">
    <goto-actions-pane></goto-actions-pane>
  </div>
</div>`,
styles: [
require("../variables.scss"),
require("../darkform.scss"), `
#full-page { display: flex; flex-direction: row; height:100vh; overflow:hidden; }
.pane { overflow-x: visible; overflow-y: scroll; min-height: 100%; }
.pane.left { overflow-y: auto; }
.pane.right { border-left: #222 1px solid; }
`]})
export class EditorViewChild_Map
{
  @ViewChild(GotoActionsPaneComponent) gotoList:GotoActionsPaneComponent;

  constructor( private selection:SelectionService )
  {
  	selection.callbacks_OnSelect.push( o=>this.gotoList.filter.from = o?o.uid:"" )
  }
}
