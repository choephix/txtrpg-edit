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

  // readonly TABS:string[] = ["locations","snippets","aliases","ini","cheatnotes","kod"]
  readonly TABS:string[] = ["locations","map","snippets","aliases","ini","kod"]
  currentTab = this.TABS[0]

	public options:any = {
	  fontSize: `12px`,
	  showGutter: true,
    fixedWidthGutter: true,
    showLineNumbers: false,
    fadeFoldWidgets: true,
	  showPrintMargin: false,
	  wrap: true,
    scrollPastEnd: 120,
    maxLines: Infinity,
    tabSize: 2,
    useSoftTabs: true
  }

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

  public get json_snippets():string
  { return JSON.stringify(this.gamedata.data.journal.snippets,null,2)+"\n\n\n" }
  public set json_snippets(value:string)
  { if(value&&value!="null") Object.assign(this.gamedata.data.journal.snippets,JSON.parse(value)) }

  public get json_aliases():string
  { return JSON.stringify(this.gamedata.data.journal.aliases,null,2)+"\n\n\n" }
  public set json_aliases(value:string)
  { if(value&&value!="null") Object.assign(this.gamedata.data.journal.aliases,JSON.parse(value)) }

  public get json_ini():string
  { return JSON.stringify(this.gamedata.data.ini,null,2)+"\n\n\n" }
  public set json_ini(value:string)
  { if(value&&value!="null") Object.assign(this.gamedata.data.ini,JSON.parse(value)) }

  constructor( public gamedata:WorldDataService ) { }
}
