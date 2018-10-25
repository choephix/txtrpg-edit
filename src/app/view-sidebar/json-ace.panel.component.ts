import { Component } from '@angular/core';
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
  #ace { min-height:20vh }
  `]
})
export class JsonAcePanelComponent
{
	public options:any = {
	  fontSize: `.9vw`,
	  showGutter: false,
    showLineNumbers: false,
	  showPrintMargin: false,
	  wrap: true,
    scrollPastEnd: 120,
	  maxLines: Infinity
	}

  public get code():string
  { return JSON.stringify(this.sele.selectedObject,null,2) }
  public set code(value:string) 
  { if(value) Object.assign(this.sele.selectedObject,JSON.parse(value)) }

  constructor( private sele:SelectionService ) {}
}
