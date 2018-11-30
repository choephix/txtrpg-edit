import { Component, ViewEncapsulation } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'sequence-tree-pane',
  templateUrl: './sequence-tree-pane.component.html',
  styleUrls: ['./../darkform.scss','./sequence-tree-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SequenceTreePaneComponent
{
  get data_nodes() { return this.gamedata.data.journal.sequences.nodes }
  get data_nodes_original() { return this.gamedata.originalData.journal.sequences.nodes }

  get data_triggers():SequenceTrigger[] { return this.gamedata.data.journal.sequences.triggers }
  get data_triggers_original() { return this.gamedata.originalData.journal.sequences.triggers }

  currentTrigger:SequenceTrigger = null

  factory_trigger = ():SequenceTrigger => ({ uid:this.uidgen.make(8),handle:"..." })

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_nodes ) )
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_triggers ) )
    // this.currentTrigger = this.listVisibleTriggers[0];
  }
}

class SequenceTrigger {
  condition?:string;
  handle:string;
  node?:string;
  uid:string;
}
