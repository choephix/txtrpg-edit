import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SelectionService
{
  public selectedObject = null
  
  public selectObject( o )
  {
    this.selectedObject = o
    console.log("Selected Object",o)
  }
}
