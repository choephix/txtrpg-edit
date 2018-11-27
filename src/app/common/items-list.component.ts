import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'items-list',
  templateUrl: 'items-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ItemsListComponent
{
  @ContentChild(TemplateRef) templateVariable:TemplateRef<any>;
  @Input() items:any[] = []
  @Input() factory:Function = null
  @Input() filter:Function = null
  @Input() trackByKey:string = null
  @Input() addItemLabel:string = "+"
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.items ) )
  }

  onContextMenu( e:MouseEvent )
  {
    // this.trigger.openMenu()
    e.preventDefault()
    e.stopPropagation()
  }

  add( index )
  {
    let item = this.factory ? this.factory() : {}
    console.log(item, this.items)
    this.items.splice(index,0,item)
  }

  clone( target, index )
  {
    let item = {}
    Object.assign( item, target )
    if ( this.factory )
      Object.assign( item, this.factory() )
    this.items.splice(index,0,item)
  }

  move( target, offset )
  {
    let index = this.items.indexOf(target)
    if ( index < 0 ) return
    if ( offset < -index ) offset = this.items.length
    if ( offset > 0 ) offset+=1
    this.items.splice(index,1)
    this.items.splice(index+offset,0,target)
  }

  delete( target )
  {
    let index = this.items.indexOf(target)
    if ( index < 0 ) return
    this.items.splice(index,1)
  }

  showDetails(item:any):boolean { return this.selection.showDetails(item) }
  trackByFn( index: any, item: any ) { return this.trackByKey ? item[this.trackByKey] : index; }
}
