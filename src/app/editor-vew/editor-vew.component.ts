import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var require:any

@Component({
  selector: 'app-editor-vew',
  templateUrl: './editor-vew.component.html'
})
export class EditorVewComponent
{
	pages:string[] = []

  constructor( public router: Router )
  {
		for ( const r of router.config )
			if ( r.path === "edit" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )
  }
}


@Component({
  // selector: '',
  styles: [`#table { height:95vh; width:100%; }`],
  template: `
  <ag-grid-angular
	  	id="table"
	    class="ag-theme-balham"
	    [singleClickEdit]="true"
	    [stopEditingWhenGridLosesFocus]="true"
	    [enableFilter]="true"
  		[enableSorting]="true"
	    [rowData]="worldData.nodes"
	    [columnDefs]="columnDefs"
  	  (gridReady)="onGridReady($event)"
	    >
		</ag-grid-angular>`
})
export class EditorViewChild_NodesTable
{
  worldData = null;

  gridApi;
  gridColumnApi;
  columnDefs = [
      { editable:true, field: 'id' , headerName: 'ID', suppressSizeToFit:true },
      { editable:true, field: 'title', headerName: 'Title' }
  ];

  constructor()
  {
    this.worldData = require('./../game/mock-world.3.json');
  }

  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }
}


@Component({
  // selector: '',
  styles: [`#table { height:95vh; width:100%; }`],
  template: `
  <ag-grid-angular
	  	id="table"
	    class="ag-theme-balham"
	    [singleClickEdit]="true"
	    [stopEditingWhenGridLosesFocus]="true"
	    [enableFilter]="true"
  		[enableSorting]="true"
    	[enableColResize]="true"
	    [rowData]="worldData.node_links"
	    [columnDefs]="columnDefs"
	    (gridReady)="onGridReady($event)"
	    >
		</ag-grid-angular>`
})
export class EditorViewChild_NodeLinksTable
{
  worldData = null;

  gridApi;
  gridColumnApi;
  columnDefs = [
      { editable:true, field: 'from' , headerName: 'from', suppressSizeToFit:true },
      { editable:true, field: 'to', headerName: 'to', suppressSizeToFit:true },
      { editable:true, field: 'handle_goto', headerName: 'on GO' },
      { editable:true, field: 'handle_gobackto', headerName: 'on GO BACK' }
  ];

  constructor()
  {
    this.worldData = require('./../game/mock-world.3.json');
  }

  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }
}


@Component({
  // selector: '',
  styles: [`#table { height:95vh; width:100%; }`],
  template: `
  <ag-grid-angular
	  	id="table"
	    class="ag-theme-balham"
	    [singleClickEdit]="true"
	    [stopEditingWhenGridLosesFocus]="true"
	    [enableFilter]="true"
  		[enableSorting]="true"
	    [rowData]="worldData.nodes"
	    [columnDefs]="columnDefs"
  		rowSelection="cell"
	    >
		</ag-grid-angular>`
})
export class EditorViewChild_Map
{
  worldData = null;

  columnDefs = [
      { editable:true, field: 'id' , headerName: '1' },
      { editable:true, field: 'title', headerName: '2' }
  ];

  constructor()
  {
    this.worldData = require('./../game/mock-world.3.json');
  }
}
