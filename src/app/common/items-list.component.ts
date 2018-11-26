import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'items-list',
  templateUrl: 'items-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ItemsListComponent
{
  @ContentChild(TemplateRef) templateVariable:TemplateRef<any>;
  @Input() items:any[] = []
  @Input() trackByKey:string = null
  @Input() itemFactoryFunc:Function = null

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.items ) )
  }

  add( index )
  {
    let item = this.itemFactoryFunc ? this.itemFactoryFunc() : {}
    this.items.splice(index,0,item)
  }

  clone( target, index )
  {
    let item = {}
    Object.assign( item, target )
    if ( this.itemFactoryFunc )
      Object.assign( item, this.itemFactoryFunc() )
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
