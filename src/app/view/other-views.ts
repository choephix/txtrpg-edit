import { Component } from '@angular/core';
import { WorldDataService } from '../services/world-data.service';
import { Node, WorldData, JournalData } from '../types/data-models';

@Component({
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
  #table {
    height:100%;
    width:100%; 
    min-height: 100vh;
    padding-left: 50px;
    box-sizing: border-box;
  }
  .ag-body-viewport {
    overflow-x: hidden;
  }
  .ag-header-cell, .ag-header-group-cell {
    padding-left: 6px;
    padding-right: 0 !important;
  }
  `],
  template: `
  <div id="toolbar">
    <button *ngFor='let b of buttons' (click)="b.f()">{{b.key}}</button>
    <br/>
    <br/>
    <ng-container *ngFor="let c of configs">
      <button (click)="config=configs[c]">{{c.buttonChar}}</button>
    </ng-container>
  </div>
  <ag-grid-angular
    id="table"
    class="ag-theme-balham"
    rowSelection='single'
    [singleClickEdit]="true"
    [stopEditingWhenGridLosesFocus]="true"
    [enableFilter]="true"
    [enableSorting]="true"
    [enableColResize]="true"
    [(rowData)]="rowData"
    [columnDefs]="columnDefs"
    (gridReady)="onGridReady($event)"
    (rowClicked)='onSelectionChanged($event)'
    *ngIf="config!=undefined"
    >
  </ag-grid-angular>
  `
})
export class EditorViewChild_AGGrid
{
	public data

  public get w():WorldData { return this.data.world }
  public get j() { return this.data.journal }
  public get rowData():any[] { return this.config.dataFunc() }
  public get columnDefs():any[] { return this.config.columnDefs }

  public configs:TableConfiguration[] = [
    {
      buttonChar:"🌄",
	  	dataFunc : () => this.j.actions.goto,
	  	columnDefs : [
	      { editable:true, field:'from',    headerName:'from',   width: 80, suppressSizeToFit:true },
	      { editable:true, field:'to',      headerName:'to',     width: 80, suppressSizeToFit:true },
	      { editable:true, field:'params',  headerName:'params', width: 80, suppressSizeToFit:true },
	      { editable:true, field:'handle', headerName:'handle', autoHeight:false },
	      { editable:true, field:'text',   headerName:'text',   autoHeight:true },
		  ]
	  },
  	{
      buttonChar:"📌",
	  	dataFunc : () => this.j.aliases,
	  	columnDefs : [
	      { editable:true, field:'uid' ,  headerName:'uid',  suppressSizeToFit:true },
	      { editable:true, field:'alias', headerName:'alias' },
	      { editable:true, field:'type',  headerName:'type'  },
		  ]
	  },
  	// "🔖" : {
	  // 	dataFunc : () => this.j.snippets,
	  // 	columnDefs : [
	  //     { editable:true, field:'key' , headerName:'key'  },
	  //     { editable:true, field:'text', headerName:'text' },
		//   ]
	  // },
  	{
      buttonChar:"🔵",
	  	dataFunc : () => this.w.nodes,
	  	columnDefs : [
	      { editable:true, field:'uid' , headerName:'UID'  },
	      { editable:true, field:'slug', headerName:'slug' },
		  ]
	  },
  ]
  config:TableConfiguration = this.configs[0]

  public buttons:{key:string,f:()=>void}[] = [
    {key:"➕",f:()=>this.add()},
    {key:"➕",f:()=>this.add(1)},
    {key:"❌",f:()=>this.del()},
  ]

	aggapi:any

  constructor( public world:WorldDataService ) { this.data = world.data }

  onGridReady(params)
  {
  	this.aggapi = params.api;
  	params.api.sizeColumnsToFit()
    // params.api.resetRowHeights()
  }

  onSelectionChanged(e)
  {
  	console.log(e)
  }

  del(): void {
    try {
      let sele = this.aggapi.getSelectedNodes()[0]
      let data = sele.data
      let index = sele.childIndex
      this.aggapi.updateRowData( { remove:[data] } )
      this.config.dataFunc().splice( index, 1 )      
    }
    catch(e) {}
  }

  add(offset=0)
  {
    let data = {}
    let index = offset === 0 ? 0 : this.config.dataFunc().length
    try {
      let sele = this.aggapi.getSelectedNodes()[0]
      let source_data = sele.data
      index = sele.childIndex + offset
      Object.assign( data, source_data )
    }
    catch(e) {}
    
    this.aggapi.updateRowData( { add:[data], addIndex:index } )
    this.config.dataFunc().splice( index, 0, data )
  }
}

class TableConfiguration
{
  buttonChar:string = ""
  columnDefs:any[] = []
  dataFunc:()=>any[];
}