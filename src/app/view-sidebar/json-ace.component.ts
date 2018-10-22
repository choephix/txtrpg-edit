import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WorldDataService } from './../services/world-data.service';
import { Logger } from './../services/logging.service';
import { DataLoader } from './../util/data-loader'
import { SelectionService } from './../services/selection.service';

@Component({
  selector: 'jsonace',
  template: `
    <div ace-editor id="ace"
         [(text)]="code"
         [mode]="'json'"
         [options]="options"
         ></div>
  `,
  styles: [`
  table { width:100%; }
  button { width:100%; padding:.5vh 0; }
  #ace { min-height:49vh }
  `]
})
export class JsonAcePanelComponent
{
	public options:any = {
	  fontSize: `.75vw`,
	  showGutter: false,
    showLineNumbers: false,
	  showPrintMargin: false,
	  wrap: true,
    scrollPastEnd: 120,
	  maxLines: Infinity
	}

  public get code():string { return JSON.stringify(this.sele,null,2) }
  public set code(value:string) { Object.assign(this.sele,JSON.parse(value)) }

  constructor( private sele:SelectionService ) {}
}
