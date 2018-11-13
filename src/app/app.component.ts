import { Component, HostListener } from '@angular/core';
import { WorldDataService } from './services/world-data.service';
import { NavigashtiService } from './services/navigashti.service';

@Component({ selector: 'app-root', template: `<router-outlet></router-outlet>` })
export class AppComponent {}

@Component({ templateUrl: './app.component.html' })
export class AppInnerComponent
{
  constructor( public world:WorldDataService, navigashti:NavigashtiService ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(e:KeyboardEvent) {
  	if ( e.keyCode == 19 && e.ctrlKey && e.shiftKey )
    	this.world.save()
    else
    	return
    e.preventDefault();
    e.stopPropagation();
  }
}
