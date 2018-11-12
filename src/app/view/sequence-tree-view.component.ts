import { Component } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from './../services/selection.service';
import { WorldDataService } from './../services/world-data.service';

@Component({
  selector: 'app-sequence-tree-view',
  templateUrl: './sequence-tree-view.component.html',
  styleUrls: ['./../darkform.scss','./sequence-tree-view.component.scss']
})
export class SequenceTreeViewComponent
{
  get data_nodes():SequenceNode[] { return this.gamedata.data.journal.sequences.nodes }
  get data_nodes_original() { return this.gamedata.originalData.journal.sequences.nodes }

  get data_triggers():SequenceTrigger[] { return this.gamedata.data.journal.sequences.triggers }
  get data_triggers_original() { return this.gamedata.originalData.journal.sequences.triggers }

  filter:Filter = new Filter

  breadcrums:Breadcrum[] = []
  currentTrigger:SequenceTrigger = null

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_nodes ) )
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_triggers ) )
    this.currentTrigger = this.listVisibleTriggers[0];
  }

  get listVisibleNodes():SequenceNode[]
  { return this.data_nodes.filter( (node,i,a)=>node.cause===this.currentCauseUID() ) }
  get listVisibleTriggers():SequenceTrigger[]
  { return this.data_triggers }

  currentCauseUID():string
  {
    if ( this.breadcrums.length == 0 )
      return this.currentTrigger.uid
    else
      return this.breadcrums[0].choice.next
  }

  // passesFilter( o:SequenceNode ):boolean
  // {
  //   if ( this.filter.search && !String(o.text).includes( this.filter.search ) ) return false
  //   return true
  // }

  goto( node, choice ):void
  {
    let o:Breadcrum = { node:node, choice:choice }
    this.breadcrums.splice(0,0,o);
    console.log(this)
  }

  gobackto( i ):void
  {
    if ( i <= 0 )
    {
      this.currentTrigger = null
      this.breadcrums.length = 0
    }
    else
    while ( this.breadcrums.length >= i )
      this.breadcrums.shift()
    console.log(this)
  }

  isDirty( o:object, key:string ):boolean
  {
    return false
  }

  isDirtyIndex( o:object ):boolean
  {
    return false
  }

  isDirtyNew( o:object ):boolean
  {
    return false
  }

  addTrigger( index )
  {
    let item:SequenceTrigger = {uid:this.uidgen.make(8),handle:"..."}
    this.data_triggers.splice(index,0,item)
    this.data_triggers_original.splice(index,0,{})
  }

  addNode( index )
  {
    let item:SequenceNode = {uid:this.uidgen.make(8),cause:this.currentCauseUID(),text:"..."}
    this.data_nodes.splice(index,0,item)
    this.data_nodes_original.splice(index,0,{})
  }

  addChoice( o:SequenceNode )
  {
    if ( !o.choices ) o.choices = []
    let index = o.choices.length
    let item:SequenceChoice = {handle:"...",next:this.uidgen.make(12)}
    o.choices.splice(index,0,item)
  }

  move( array, target, offset )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    array.splice(index,1)
    array.splice(index+offset,0,target)
  }

  delete( array, target )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    array.splice(index,1)
  }

  fixTextarea(el) { el.style.height = el.scrollHeight + "px" }

  trackByFn(index: any, item: any) { return index; }
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
  choices?:SequenceChoice[]
}
class SequenceChoice {
  condition?:string;
  handle:string;
  next:string;
}
class SequenceTrigger {
  condition?:string;
  handle:string;
  node?:string;
  uid:string;
}


class Filter
{
  public disabled:boolean = false
  public get active():boolean { return !!( this.trigger || this.type || this.search ) }
  constructor( public trigger:string='', public type:string='', public search:string='' ) {}
}
