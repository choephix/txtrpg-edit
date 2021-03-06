import { Component } from '@angular/core';
import { WorldDataService } from './../services/world-data.service';
import { LocationNode, LocationSubnode } from '../types/data-models';

@Component({
  selector: 'journal-helper-pane',
  templateUrl: './journal-helper-pane.component.html',
  styleUrls: ['./../darkform.scss',"journal-helper-pane.component.scss"],
})
export class JournalHelperPaneComponent
{
  readonly TABS:string[] = ["locations","map","snippets","aliases","ini","kod"]
  currentTab = this.TABS[0]

	public options_kod:any = {
	  fontSize: `11px`,
	  showGutter: true,
    fixedWidthGutter: true,
    showLineNumbers: true,
    fadeFoldWidgets: true,
	  showPrintMargin: false,
	  wrap: true,
    scrollPastEnd: 120,
    maxLines: Infinity,
    tabSize: 2,
    useSoftTabs: true
  }

  constructor( public gamedata:WorldDataService ) { }
}

@Component({
  selector: "locations-list",
  styleUrls: ['./../darkform.scss',"journal-helper-pane.component.scss"],
  template: `
  <div class="darkform">
    <div class="item">
      <flex-row>
        <div cell style="flex: 3">
          <label>search</label>
          <div><input type="text" [(ngModel)]="filterLocations"></div>
          <div space></div>
          <label>Location nodes and subnodes in this world</label>
        </div>
      </flex-row>
    </div>
    <div class="divider" [class.active]="!!filterLocations"></div>
    <div class="items-list">
      <ng-container *ngFor="let loc of locations">
      <ng-container *ngIf="!filterLocations||loc.slug.includes(filterLocations)">
        <flex-row class="item">
          <div class="cell-uid">{{loc.uid}}</div>
          <div class="cell-slug">{{loc.slug}}</div>
        </flex-row>
        <ng-container *ngFor="let sub of subnodes">
        <ng-container *ngIf="sub.parent==loc.uid||sub.parent==loc.slug">
          <flex-row>
            <div indent></div>
            <flex-row class="item" style="flex:1 1">
              <div class="cell-uid">{{sub.uid}}</div>
              <div class="cell-slug">{{sub.slug}}</div>
            </flex-row>
          </flex-row>
        </ng-container>
        </ng-container>
      </ng-container>
      </ng-container>
    </div>
  </div>`
})
export class LocationsListComponent
{
  filterLocations:string= ''
  get locations():LocationNode[] { return this.gamedata.data.world.locations }
  get subnodes():LocationSubnode[] { return this.gamedata.data.world.subnodes }
  constructor( private gamedata:WorldDataService ) { }
}
