import { Directive, HostBinding, HostListener, Input } from "@angular/core";
import { SelectionService } from "../services/selection.service";

@Directive({ selector: "[selectable]" })
export class SelectableDirective
{
  @Input('selectable') o:object;

  @HostBinding('class.selected') get selected():boolean
  { return this.selection.selectedObject === this.o }

	constructor( private selection:SelectionService ) {}

  @HostListener('mousedown', ['$event'])
  onClick(e:MouseEvent):void
  {
    // console.log(e)
    if ( !this.o )
      return;
    if ( e.detail === 3 || e.button === 1 )
    {
      this.selection.selectObject(this.o)
      this.selection.detailedMode = !this.selection.detailedMode
      e.preventDefault()
      e.stopPropagation()
    }
    else
    if ( e.detail === 1 && e.button === 0 )
    {
      this.selection.selectObject(this.o)
    }
  }
}
