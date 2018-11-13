import { Component } from '@angular/core';
import { NavigashtiService } from '../services/navigashti.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent
{
  constructor( public navi:NavigashtiService ) {}
}
