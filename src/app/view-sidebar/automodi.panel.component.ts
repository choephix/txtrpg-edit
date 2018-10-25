import { UID_GenerationService } from './../services/id-gen.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorldDataService } from '../services/world-data.service';
import { Logger } from '../services/logging.service';
import { DataLoader } from '../util/data-loader'

const ALL_BRANCHES:string[] = ["shitbox","develop","lorem","poc","master"]

@Component({
  selector: 'automodi',
  template: `
    <div ace-editor id="ace"
         [(text)]="code"
         [mode]="'javascript'"
         [options]="options"
         ></div>

		<table class="tabs">
			<tr>
				<th *ngFor='let b of buttons' (click)="b.f()">
				  <button>{{b.key}}</button>
				</th>
			</tr>
		</table>

    <form>
      <label *ngFor="let b of getAllBranches()">
        <input type="checkbox" [(ngModel)]="branches[b]" name="{b}">
        <code>  {{b}}</code>
        <br/>
      </label>
    </form>
  `,
  styles: [`
  table { width:100%; }
  button { width:100%; padding:.5vh 0; }
  #ace { min-height:20vh }
  `]
})
export class AutomodiPanelComponent
{
  code:string = `
  for ( let node of this.world.nodes )\n\tconsole.log(node) \n
  // Use this space to code global changes
  // to the json map structure, like
  // creating new objects, deleting old ones
  // or populating/truncating arrays, etc.
  // Code is run and for all branches one by one.
  // Have a good time, and don't break anything!
  \n\n\n\n\n\n\n\n`;

	public buttons:{key:string,f:()=>void}[] = [
	    {key:"TEST CURRENT",f:()=>this.testCurrent()},
	    {key:"TEST ALL",f:()=>this.testAll()},
	    {key:"COMMIT ALL",f:()=>this.commitAll()},
	  ]

	public options:any = {
	  fontSize: `.75vw`,
	  showGutter: false,
	  showPrintMargin: false,
	  wrap: true,
	  maxLines: Infinity,
	}

  public branches = {}

  private modify = function(code,uidgen):void 
  {
    function hash(len=6) { return uidgen.generateHash(len) }
    eval(code);
    console.log(this)
  }

  constructor( private http:HttpClient,
               private globalWorld:WorldDataService,
               private logger:Logger,
               private uidgen:UID_GenerationService )
  {
    for ( let b of ALL_BRANCHES )
      this.branches[b] = true
  }

  public getAllBranches():string[]
  { return Object.keys(this.branches) }

  private getSelectedBranches():string[]
  {
    let list: string[] = []
    for ( let name of this.getAllBranches() )
      if ( this.branches[name] )
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
            world.save().subscribe(
              data => this.logger.success("wohoo...",`${branch} :: Updated!`),
              error => this.logger.katch(error,`Can't commit to ${branch}`)
            )
          },
        error => this.logger.katch(error,`Can't load ${branch}`)
      )
		}
  }
}