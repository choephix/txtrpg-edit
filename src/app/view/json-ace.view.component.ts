import { Component } from '@angular/core';
import { WorldDataService } from '../services/world-data.service';
import { Logger } from '../services/logging.service';

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
    {key:"🔄",f:()=>this.refresh()},
    // {key:"#️⃣",f:()=>this.options.showLineNumbers=!this.options.showLineNumbers},
    // {key:"◀",f:()=>this.options.showGutter=!this.options.showGutter},
  ]

  public options:any = {
    fontSize: `10px`,
    showGutter: true,
    fixedWidthGutter: true,
    showLineNumbers: true,
    showPrintMargin: false,
    fadeFoldWidgets: true,
    wrap: true,
    scrollPastEnd: 120,
    maxLines: Infinity,
  }

	public json:string = "{}\n"

  constructor( public world:WorldDataService, private logger:Logger ) { this.refresh() }
  
  refresh() 
  {
    this.json = this.world.getJson() 
    this.logger.info("Fresh data loaded.","Ace JSON Editor")
    console.log(this.options)
  }

  save()
  {
    try
    {
      this.world.applyData( this.json )
      this.logger.info("Changes applied!","Ace JSON Editor")
    }
    catch ( e )
    { this.logger.katch( e,"JSON Editor (Ace)" ) }
  }
}
