import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorldDataService } from './../services/world-data.service';
import { SelectionService } from './../services/selection.service';

declare var angular: any;
declare var JSONEditor: any;

@Component({ templateUrl: './editor-view.component.html' })
export class EditorVewComponent
{
  public branches:string[] = ["master","poc","lorem","develop","shitbox"]
	public pages:string[] = []
	public sidetabs:string[] = ["json","automodi","else","elser"]
  
  public branch:string = "develop"
  public page:string = null
  public sidetab:string = this.sidetabs[1]

  constructor( public router:Router, 
               private route:ActivatedRoute, 
               public world:WorldDataService, 
               public selection:SelectionService )
  {
    this.route.paramMap.subscribe( params => {
    	this.branch = params.get("branch")
    	if ( !this.branch ) console.warn("no branch?",params)
    	else world.load(this.branch)
    } );

		for ( const r of router.config )
			if ( r.path === ":branch" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )
  }
  
  private jsoneditor
  private jsoneditor_options = {
    mode:'form',
    modes:['tree','view','form','code','text'],
    navigationBar:false,
    statusBar:false,
    search:false,
    onChange:()=>this.onJsonDataChange()
  };
  @ViewChild('jsoneditor') jsoneditor_ref:ElementRef;
  ngAfterViewInit() {
    this.jsoneditor = new JSONEditor(
                          this.jsoneditor_ref.nativeElement, 
                          this.jsoneditor_options,
                          {} );
    this.selection.callbacks_OnSelect.push( o => this.jsoneditor.set(o) )
  }
  
  onJsonDataChange()
  {
    this.selection.dispatchObjectModified( this.jsoneditor.get() )
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(e:KeyboardEvent) {
  	if ( e.keyCode == 19 && e.ctrlKey && e.shiftKey )
    	this.world.save()
    else
    	return
    e.preventDefault();
    e.stopPropagation();
  }

  log(o) { console.log(o) }
}

/// /// ///
  /// ///
/// /// ///
  /// ///
/// /// ///

import { HttpClient, HttpHeaders } from '@angular/common/http';
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
	   wrap: true,
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
      world.load( false ).subscribe( 
        data => process.call(data),
        )
		}
  }
	  
  private doCommit()
  {
    
  }
}

// 

// 

// 

@Component({
  styles: [`#table { height:100%; width:100%; }`],
  template: `
		<ag-grid-angular
			id="table"
			class="ag-theme-balham"
			rowSelection='single'
			[singleClickEdit]="true"
			[stopEditingWhenGridLosesFocus]="true"
			[enableFilter]="true"
			[enableSorting]="true"
			[rowData]="rowData"
			[columnDefs]="columnDefs"
			(gridReady)="onGridReady($event)"
			(rowClicked)='onSelectionChanged($event)'
			*ngIf="config!=undefined"
			>
		</ag-grid-angular>
	  <ng-container *ngFor="let c of objectKeys(configs)">
		  <button (click)="config=configs[c]">{{c}}</button>
	  </ng-container>
		<br/>
		<button (click)="clone()">➕</button>
		`
})
export class EditorViewChild_NodesTable
{
	public gitbub

  public get w() { return this.gitbub.data }
  public get rowData():any[] { return this.config.dataFunc() }
  public get columnDefs():any[] { return this.config.columnDefs }

  objectKeys = Object.keys;
  configs = {
  	"ALIASES" : {
	  	dataFunc : () => this.w.aliases,
	  	columnDefs : [
	      { editable:true, field:'key' ,  headerName:'key',  suppressSizeToFit:true },
	      { editable:true, field:'alias', headerName:'alias' },
	      { editable:true, field:'type',  headerName:'type'  },
		  ]
	  },
  	"NODES" : {
	  	dataFunc : () => this.w.nodes,
	  	columnDefs : [
	      { editable:true, field:'id' ,   headerName:'ID',   suppressSizeToFit:true },
	      { editable:true, field:'title', headerName:'title' },
		  ]
	  },
  	"TEXT/LINKS" : {
	  	dataFunc : () => this.w.text_node_links,
	  	columnDefs : [
	      { editable:true, field:'from',   headerName:'from',   suppressSizeToFit:true },
	      { editable:true, field:'to',     headerName:'to',     suppressSizeToFit:true },
	      { editable:true, field:'flags',  headerName:'flags',  suppressSizeToFit:true },
	      { editable:true, field:'handle', headerName:'handle', autoHeight:true },
	      { editable:true, field:'text',   headerName:'text',   autoHeight:true }
		  ]
	  },
  }
  config:TableConfiguration = this.configs["ALIASES"]

	aggapi:any

  constructor( public world:WorldDataService ) { this.gitbub = world }

  onGridReady(params)
  {
  	this.aggapi = params.api;
  	params.api.sizeColumnsToFit()
    params.api.resetRowHeights()
  }

  onSelectionChanged(e)
  {
  	console.log(e)
  }

  clone()
  {
  	let from = this.aggapi.getSelectedRows()[0]
  	let i = this.rowData.indexOf(from)+1

  	console.log(i,from,this.aggapi)

  	let o = {}
  	Object.assign(o,from)

  	this.aggapi.updateRowData( { add:[o], addIndex:i } )
  }
}

class TableConfiguration
{
  columnDefs:any[] = []
  dataFunc:()=>any[];
}

// 

// 

// 

@Component({
  // selector: '',
  styles: [`#table { height:100vh; width:100%; }`],
  template: `
  <ag-grid-angular
	  	id="table"
	    class="ag-theme-balham"
	    [singleClickEdit]="true"
	    [stopEditingWhenGridLosesFocus]="true"
	    [enableFilter]="true"
  		[enableSorting]="true"
    	[enableColResize]="true"
	    [rowData]="worldData.text_node_links"
	    [columnDefs]="columnDefs"
	    (gridReady)="onGridReady($event)"
	    >
		</ag-grid-angular>`
})
export class EditorViewChild_NodeLinksTable
{
  public get worldData() { return this.gitbub.data }

  public columnDefs = [
      { editable:true, field: 'from' , headerName: 'from', suppressSizeToFit:true },
      { editable:true, field: 'to', headerName: 'to', suppressSizeToFit:true },
      { editable:true, field: 'flags', headerName: 'flags', suppressSizeToFit:true },
      { editable:true, field: 'handle', headerName: 'handle', autoHeight: true },
      { editable:true, field: 'text', headerName: 'text', autoHeight: true }
  ];

	private gitbub

  constructor( public world:WorldDataService )
  { this.gitbub = world }

  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights()
  }
}

// 

// 

// 

@Component({
  // selector: '',
  styles: [`
  #panel {
    
  }
  #jsoneditor {
    box-sizing: border-box;
    height: 100vh;
  }
  `],
  template: `
  <div id="edit-properties-panel">
	  <div id="jsoneditor" #jsoneditor></div>
  </div>`
})
export class EditorViewChild_FullJson
{
  @ViewChild('jsoneditor') jsoneditor_ref:ElementRef;
  public get worldData() { return this.gitbub.data }
	private gitbub
  private jsoneditor
  
  private jsoneditor_options = {
    mode:'tree',
    modes:['tree','view','form','code','text'],
    navigationBar:true,
    statusBar:true,
    search:true,
    onChange:()=>this.onJsonDataChange()
  };

  constructor( public world:WorldDataService )
  { 
    this.gitbub = world 
  }
  
  ngAfterViewInit() {
    this.jsoneditor = new JSONEditor(
                          this.jsoneditor_ref.nativeElement, 
                          this.jsoneditor_options,
                          this.worldData );
  }
  
  onJsonDataChange()
  {
    console.log()
  }
}
