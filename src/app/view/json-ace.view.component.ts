import { Component } from '@angular/core';
import { WorldDataService } from '../services/world-data.service';

@Component({
  // selector: '',
  styles: [`
  #toolbar {
    width:50px;
    height:100%;
    position: fixed;
    background-color: #E8E8E8;
    box-sizing: border-box;
    outline:1px solid #999;
  }
  #toolbar button {
    width:100%;
    height:50px;
    font-size: 20px;
  }
  #ace {
    box-sizing: border-box;
    margin-left: 50px;
    min-height: 100vh;
  }
  `],
  template: `
    <div id="toolbar">
		  <button
		    *ngFor='let b of buttons'
		    (click)="b.f()"
		    >{{b.key}}</button>
		</div>
    <div ace-editor id="ace"
         [(text)]="json"
         [mode]="'javascript'"
         [options]="options"
         ></div>`
})
export class EditorViewChild_FullJsonAce
{
  public buttons:{key:string,f:()=>void}[] = [
    {key:"💾",f:()=>this.save()},
    {key:"💿",f:()=>this.save()},
    {key:"📀",f:()=>this.save()},
    {key:"🔄",f:()=>this.refresh()},
  ]

  public options:any = {
    fontSize: `10px`,
    showGutter: true,
    fixedWidthGutter: true,
    showLineNumbers: false,
    showPrintMargin: false,
    fadeFoldWidgets: true,
    wrap: true,
    scrollPastEnd: 120,
    maxLines: Infinity,
  }

	public json:string = "{}\n"

  constructor( public world:WorldDataService ) { this.refresh() }

  refresh() { this.json = this.world.getJson() }

  save() { this.world.applyData( this.json ) }
}
