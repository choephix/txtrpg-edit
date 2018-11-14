import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({ selector: "[autoresize]" })
export class AutoresizeDirective
{
  @Input('autoresize') maxHeight:number;

	constructor( public element:ElementRef ) {}

  ngOnInit():void { this.adjust(); }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement):void { this.adjust() }

  @HostListener('click', ['$event.target'])
  onClick(textArea: HTMLTextAreaElement):void { this.adjust() }

  adjust():void
  {
    let el = this.element.nativeElement
    let newHeight
		if (el) {
			el.style.overflow = "hidden";
      el.style.height = "auto";
      if (this.maxHeight) {
        newHeight = Math.min(el.scrollHeight, this.maxHeight);
      } else {
        newHeight = el.scrollHeight;
      }
      el.style.height = newHeight + "px";
		}
	}
}
