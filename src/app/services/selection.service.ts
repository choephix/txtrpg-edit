import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SelectionService
{
  public selectedObject = null
  
  public callbacks_OnSelect:((selectedObject:any)=>void)[] = [ ]
  public callbacks_OnModify:((newProperties:any)=>void)[] = [ ]
  
  public selectObject( o )
  {
    this.selectedObject = o
    
    for ( let f of this.callbacks_OnSelect )
      try { f(o) } catch( e ) { console.error(e) }
  }
  
  public dispatchObjectModified( o=null )
  {
    for ( let f of this.callbacks_OnModify )
      try { f(o) } catch( e ) { console.error(e) }
    Object.assign( this.selectedObject, o )
  }
}
