import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'items-list',
  templateUrl: 'items-list.component.html',
})
export class ItemsListComponent
{
  @ContentChild(TemplateRef) templateVariable:TemplateRef<any>;
  @Input() list:any[] = []
  @Input() trackByKey:string = null

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.list ) )
  }

  add( index )
  {
  }

  move( array, target, offset )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    if ( offset < -index ) offset = array.length
    array.splice(index,1)
    array.splice(index+offset,0,target)
  }

  delete( array, target )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    array.splice(index,1)
  }

  trackByFn( index: any, item: any ) { return this.trackByKey ? item[this.trackByKey] : index; }
}
