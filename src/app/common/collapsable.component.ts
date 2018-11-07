import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsable',
  template: `
  <div class="label"
       style="padding:5px;cursor:pointer;"
       (click)="expanded=!expanded"
       >{{!expanded?'▾':'▴'}} {{label}}</div>
  <ng-content *ngIf="expanded"></ng-content>
  `,
})
export class CollapsableComponent
{
  @Input() label:string
  @Input() expanded:boolean = true
}
