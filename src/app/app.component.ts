import { Component } from '@angular/core';
import { NavigashtiService } from './services/navigashti.service';
import { SelectionService } from './services/selection.service';
import { WorldDataService } from './services/world-data.service';

@Component({ selector: 'app-root', template: `<router-outlet></router-outlet>` })
export class AppComponent {}

@Component({ templateUrl: './app.component.html' })
export class AppInnerComponent
{
  constructor( navigashti:NavigashtiService,
               public world:WorldDataService,
               private selection:SelectionService
             ) {}

  onKey(e:KeyboardEvent)
  {
    if ( e.keyCode == 83 && e.ctrlKey )
    {
      this.world.save()
      e.preventDefault()
      e.stopPropagation()
    }
    else
    if ( e.keyCode == 68 && e.ctrlKey && e.shiftKey )
    {
      this.selection.detailedModeEverywhere =
          !this.selection.detailedModeEverywhere
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
