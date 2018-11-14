import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SelectionService
{
  public selectedObject = null
  public detailedMode:boolean = false
  public detailedModeEverywhere:boolean = false

  public callbacks_OnSelect:((selectedObject:any)=>void)[] = [ ]
  public callbacks_OnModify:((newProperties:any)=>void)[] = [ ]

  public selectObject( o )
  {
    if ( this.selectedObject === o )
      return

    this.selectedObject = o
    this.detailedMode = false;

    for ( let f of this.callbacks_OnSelect )
      try { f(o) } catch( e ) { console.error(e) }
  }

  showDetails( o:object )
  {
    return this.detailedModeEverywhere ||
         ( this.detailedMode && this.selectedObject === o )
  }

  public dispatchObjectModified( o=null )
  {
    for ( let f of this.callbacks_OnModify )
      try { f(o) } catch( e ) { console.error(e) }
    Object.assign( this.selectedObject, o )
  }
}
