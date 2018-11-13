import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[mousewheel]'
})
export class MouseWheelDirective 
{
  @Output() wheel = new EventEmitter();

  @HostListener('mousewheel', ['$event']) 
  onMouseWheelChrome(event: any) 
  { this.mouseWheelFunc(event); }

  @HostListener('DOMMouseScroll', ['$event']) 
  onMouseWheelFirefox(event: any) 
  { this.mouseWheelFunc(event); }

  @HostListener('onmousewheel', ['$event']) 
  onMouseWheelIE(event: any) 
  { this.mouseWheelFunc(event); }

  mouseWheelFunc( event:WheelEvent ):void
  {
    this.wheel.emit(event)
    event.preventDefault();
  }
}
