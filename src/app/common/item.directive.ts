import { Directive, HostBinding, HostListener, Input } from "@angular/core";
import { SelectionService } from "../services/selection.service";

@Directive({ selector: "[selectable]" })
export class ItemDirective
{
  @Input('selectable') o:object;

  @HostBinding('class.selected') get selected():boolean
  { return this.selection.selectedObject === this.o }

	constructor( private selection:SelectionService ) {}

  @HostListener('click', ['$event'])
  onClick(e:MouseEvent):void
  {
    if ( !this.o )
      return;
    if ( e.detail === 3 )
      this.selection.detailedMode = !this.selection.detailedMode
    else
    if ( e.detail === 1 )
      this.selection.selectObject(this.o)
  }
}
