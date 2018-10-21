import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorldDataService } from './../services/world-data.service';
import { SelectionService } from './../services/selection.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Logger } from './../services/logging.service';
import { DataLoader } from './../util/data-loader'

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
//   @ViewChild('jsoneditor') jsoneditor_ref:ElementRef;
//   public get worldData() { return this.gitbub.data }
// 	private gitbub
//   private jsoneditor
  
//   private jsoneditor_options = {
//     mode:'tree',
//     modes:['tree','view','form','code','text'],
//     navigationBar:true,
//     statusBar:true,
//     search:true,
//     onChange:()=>this.onJsonDataChange()
//   };

//   constructor( public world:WorldDataService )
//   { 
//     this.gitbub = world 
//   }
  
//   ngAfterViewInit() {
//     this.jsoneditor = new JSONEditor(
//                           this.jsoneditor_ref.nativeElement, 
//                           this.jsoneditor_options,
//                           this.worldData );
//   }
  
//   onJsonDataChange()
//   {
//     console.log()
//   }
}

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
	   fontSize: `11px`,
	   showGutter: true,
	   fixedWidthGutter: true,
	   showLineNumbers: false,
	   showPrintMargin: false,
	   fadeFoldWidgets: true,
	   wrap: true,
	   scrollPastEnd: 120,
	   maxLines: Infinity,
	 }
  
  constructor( public world:WorldDataService ) { }
  
  public get json():string { return this.world.getJson() }
  public set json(value:string) { this.world.applyData( value ) }

  refresh() {
  }
  
  save() {
    
  }
}
