import { Component, ViewChild, Input } from '@angular/core';
import { WorldDataService } from '../services/world-data.service';
import { Logger } from '../services/logging.service';

@Component({
  // selector: '',
  styles: [`
  #father {
    display:flex;
    flex-direction:row;
    height:100%;
    overflow:hidden;
  }
  #toolbar {
    width:50px;
    height:100%;
    box-sizing: border-box;
  }
  #toolbar button {
    width:100%;
    height:50px;
    font-size: 20px;
    color: #FFF;
  }
  #ace-wrapper {
    box-sizing: border-box;
    overflow: auto;
    height: 100vh;
    flex-grow:1;
  }
  #ace {
    box-sizing: border-box;
    min-height: 100vh;
    width:100%;
  }
  `],
  template: `
  <div id="father">
    <div id="toolbar" class="dark-theme">
		  <button *ngFor='let b of buttons' (click)="b.f()">{{b.key}}</button>
    </div>
    <div id="ace-wrapper">
      <ace-editor id="ace" #ace
          [(text)]="json"
          [theme]="theme"
          [mode]="mode"
          [options]="options"
          ></ace-editor>
    </div>
  </div>`
})
export class EditorViewChild_FullJsonAce
{
  @ViewChild('ace') ace
  @Input() theme:string = "tomorrow_night_blue"
  @Input() mode:string = "json"

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
    tabSize: 2,
    useSoftTabs: true
  }

	public json:string = "{}\n"

  constructor( public world:WorldDataService, private logger:Logger ) {}

  ngOnInit()
  {
    this.refresh()
  }

  refresh()
  {
    this.json = this.world.getJson()
    // this.logger.info("Fresh data loaded.","Ace JSON Editor")
    // console.log(this.options)

    console.log( this )
    // this.ace.setTheme("idle_fingers");

    // let options = { children: false, siblings: true }
    // this.ace.getEditor().toggleFoldWidget( 2, options );

    console.log( this.ace )
    console.log( this.ace.getEditor() )
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

// idle_fingers -- gray light, accents strings and keys over numbers
