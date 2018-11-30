import { UID_GenerationService } from './../services/id-gen.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorldDataService } from '../services/world-data.service';
import { Logger } from '../services/logging.service';
import { DataLoader } from '../util/data-loader'
import { NavigashtiService } from '../services/navigashti.service';

@Component({
  selector: 'automodi',
  template: `
    <ace-editor id="ace"
         mode="typescript"
         theme="ambiance"
         [(text)]="code"
         [options]="options"
         ></ace-editor>

		<table class="tabs">
			<tr>
				<th *ngFor='let b of buttons' (click)="b.f()">
				  <button class="dark">{{b.key}}</button>
				</th>
			</tr>
		</table>

    <form>
      <label *ngFor="let b of branches">
        <p (click)="toggleBranch(b)"
           [class.true]="branchEnabled(b)"
           [class.false]="!branchEnabled(b)">{{b}}</p>
      </label>
    </form>
  `,
  styles: [`
  #ace { min-height:20vh }
  table { width:100%; }
  form { margin:8px; }
  p { cursor: pointer; }
  p.false { text-decoration: line-through; }
  p.true { color: #DEF; }
  * { transition: color .150s, background .150s, border .150s, transform .150s; }
  `]
})
export class AutomodiPanelComponent
{
  code:string = `
let list = this
    .journal.actions.goto

for ( let o of list )
    console.log(o)

// Use this space to code global
// changes to the json game data,
// like creating new objects,
// deleting old ones or
// populating/truncating arrays,
// etcetera.
//
// tricks:
// hash(len) - new uid
//
// Don't break anything!
\n\n\n\n\n\n\n\n`;

	public buttons:{key:string,f:()=>void}[] = [
	    {key:"TEST CURRENT",f:()=>this.testCurrent()},
	    {key:"TEST ALL",f:()=>this.testAll()},
	    {key:"COMMIT ALL",f:()=>this.commitAll()},
	  ]

	public options:any = {
	  fontSize: `10px`,
	  showGutter: false,
	  showPrintMargin: false,
	  wrap: true,
	  maxLines: Infinity,
    scrollPastEnd: 120,
    tabSize: 1,
    useSoftTabs: true
	}

  public ignore = []

  get branches():string[] { return this.navi.branches }

  private modify = function(code,uidgen):void
  {
    function hash(len=6) { return uidgen.make(len) }
    eval(code);
    console.log(this)
  }

  constructor( private http:HttpClient,
               private globalWorld:WorldDataService,
               private navi:NavigashtiService,
               private logger:Logger,
               private uidgen:UID_GenerationService ) {}

  toggleBranch(b)
  {
    let i = this.ignore.indexOf(b)
    if ( i < 0 ) this.ignore.push(b)
    else         this.ignore.splice(i,1)
  }

  branchEnabled(b) { return this.ignore.indexOf(b) < 0  }

  private getSelectedBranches():string[]
  {
    let list: string[] = []
    for ( let name of this.navi.branches )
      if ( this.ignore.indexOf(name) < 0 )
        list.push(name)
    return list
  }

  private testCurrent()
  {
    this.modify.call( this.globalWorld.data, this.code, this.uidgen )
    console.log( this.globalWorld.data )
  }

  private testAll()
  {
    let branches = this.getSelectedBranches()
		for ( let branch of branches )
		{
      let world = new DataLoader( this.http )
      world.setBranch( branch )
      world.load( "raw" ).subscribe(
        data => this.modify.call(data,this.code,this.uidgen),
        error => this.logger.katch(error,`Can't load ${branch}`)
        )
		}
  }

  private commitAll()
  {
    let branches = this.getSelectedBranches()
    if( !confirm( `Are you sure you want to commit to all of these branches:\n${branches}` ) )
      return
		for ( let branch of branches )
		{
      let world = new DataLoader( this.http )
      world.setBranch( branch )
      world.load( "api" ).subscribe(
        data => {
            this.modify.call(data,this.code,this.uidgen)
            world.save("Batch change (probably structural) via online editor Automodi").subscribe(
              data => this.logger.success("wohoo...",`${branch} :: Updated!`),
              error => this.logger.katch(error,`Can't commit to ${branch}`)
            )
          },
        error => this.logger.katch(error,`Can't load ${branch}`)
      )
		}
  }
}
