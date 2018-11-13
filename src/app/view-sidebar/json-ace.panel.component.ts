import { Component, Input } from '@angular/core';
import { SelectionService } from '../services/selection.service';

@Component({
  selector: 'jsonace',
  template: `
    <ace-editor id="ace"
        [theme]="theme"
        [mode]="mode"
        [options]="options"
        [(text)]="code"
         ></ace-editor>
  `,
  styles: [`
  #ace { min-height:10vh }
  `]
})
export class JsonAcePanelComponent
{
  @Input() theme:string = "ambiance"
  @Input() mode:string = "json"

	public options:any = {
	  fontSize: `9px`,
	  showGutter: false,
    showLineNumbers: false,
	  showPrintMargin: false,
	  wrap: true,
    scrollPastEnd: 120,
	  maxLines: Infinity,
    tabSize: 2,
    useSoftTabs: true
	}

  public get code():string
  { return !this.sele.selectedObject ? "n/a" : JSON.stringify(this.sele.selectedObject,null,2)+"\n" }
  public set code(value:string)
  { if(this.sele.selectedObject&&value&&value!="null")
      Object.assign(this.sele.selectedObject,JSON.parse(value)) }

  constructor( private sele:SelectionService ) {}
}
