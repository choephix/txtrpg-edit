import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from './../services/logging.service';
import { DataLoader } from './../util/data-loader'

@Component({
  selector: 'automodi',
  template: `
		<table class="tabs">
			<tr>
				<th *ngFor='let b of buttons' (click)="b.f()">
				  <button>{{b.key}}</button>
				</th>
			</tr>
		</table>
		
    <div ace-editor id="ace"
         [(text)]="code"
         [mode]="'javascript'"
         [options]="options"
         ></div>
  `,
  styles: [`
  table { width:100%; }
  button { width:100%; padding:.5vh 0; }
  #ace { height:49vh }
  `]
})
export class AutomodiPanelComponent
{
	ALL_BRANCHES:string[] = ["shitbox","develop","lorem","poc","master"]
	
  code:string = `
console.log(this.global.time)

// Use this space to code global changes 
// to the json map structure, like
// creating new objects, deleting old ones
// or populating/truncating arrays, etc.
// Code is run and for all branches one by one.
// Have a good time, and don't break anything!
\n\n\n\n\n\n\n\n`;
  
	public buttons:{key:string,f:()=>void}[] = [
	    {key:"CLEAR",f:()=>this.doClear()},
	    {key:"TEST",f:()=>this.doTest()},
	    {key:"COMMIT",f:()=>this.doCommit()},
	  ]
	  
	 public options:any = {
	   fontSize: `.75vw`,
	   showGutter: false,
	   showPrintMargin: false,
	   wrap: true,
	   maxLines: Infinity,
	 }

  constructor( public http:HttpClient, public toast:Logger ) {}
	  
  private doClear()
  {
    this.code = ""
  }
	  
  private doTest()
  {
    let branches = this.ALL_BRANCHES
    let code = this.code
    
    let process = function():void
    {
			eval(code)
			console.log(this)
    }
    
		for ( let branch of branches )
		{
      let world = new DataLoader( this.http )
      world.setBranch( branch )
      world.load( "api" ).subscribe( 
        data => process.call(data),
        )
		}
  }
	  
  private doCommit()
  {
    
  }
}
