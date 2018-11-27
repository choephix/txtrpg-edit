import { Component, Input } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'sequence-tree-list',
  templateUrl: './sequence-tree.list.component.html'
})
export class SequenceTreeListComponent
{
  @Input() rootCause:string = null

  get data_nodes():SequenceNode[] { return this.gamedata.data.journal.sequences.nodes }
  get data_nodes_original() { return this.gamedata.originalData.journal.sequences.nodes }

  makeNode = ():SequenceNode =>
  {
    return {
      uid:this.uidgen.make(8),
      type:this.breadcrums.length?this.breadcrums[0].node.type:undefined,
      cause:this.currentCauseUID(),
      text:" • • • ",
      choices:[ ]
      // choices:[ this.makeChoice() ]
    }
  }

  makeChoice = ():SequenceChoice =>
  { return {handle:"...",next:this.uidgen.make(12)} }

  filterNode = (node):boolean =>
  { return node.cause===this.currentCauseUID() }

  breadcrums:Breadcrum[] = []

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_nodes ) )
  }

  currentCauseUID():string
  {
    if ( this.breadcrums.length == 0 )
      return this.rootCause
    else
      return this.breadcrums[0].choice.next
  }

  goto( node, choice ):void
  {
    let o:Breadcrum = { node:node, choice:choice }
    this.breadcrums.splice(0,0,o);
  }

  gobackto( i ):void
  {
    if ( i <= 0 )
    {
      this.rootCause = null
      this.breadcrums.length = 0
    }
    else
    while ( this.breadcrums.length >= i )
      this.breadcrums.shift()
  }
}

class Breadcrum {
  node:SequenceNode;
  choice:SequenceChoice;
}
class SequenceNode {
  uid:string;
  cause:string;
  type?:string;
  text:string;
  condition?:string;
  code?:string;
  choices:SequenceChoice[]
}
class SequenceChoice {
  condition?:string;
  handle:string;
  next:string;
}
