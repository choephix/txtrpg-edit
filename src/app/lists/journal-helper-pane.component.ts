import { Component } from '@angular/core';
import { WorldDataService } from './../services/world-data.service';

@Component({
  selector: 'journal-helper-pane',
  templateUrl: './journal-helper-pane.component.html',
  styleUrls: ['./../darkform.scss',"journal-helper-pane.component.scss"],
})
export class JournalHelperPaneComponent
{
  filterLocations:string= ''

  constructor( public gamedata:WorldDataService ) { }
}
