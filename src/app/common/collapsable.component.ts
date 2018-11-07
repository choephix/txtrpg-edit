import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsable',
  template: `
  <div class="label" (click)="expanded=!expanded" style="padding:5px">{{!expanded?'▾':'▴'}} {{label}}</div>
  <ng-content *ngIf="expanded"></ng-content>
  `,
})
export class CollapsableComponent
{
  @Input() label:string
  @Input() expanded:boolean = true
}
