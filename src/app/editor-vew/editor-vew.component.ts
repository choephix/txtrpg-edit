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

  log(o) { console.log(o) }
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

// <image x="{{i*16}}" y="{{i*12}}"
  					 //xlink:href="https://image.flaticon.com/icons/svg/64/64113.svg"></image>

@Component({
  // selector: '',
  styles: [`
  #lesvg { height:99.5vh; width:100%; }
  .node { stroke:rgba(100,200,250,0.5); stroke-width:4; fill:rgba(50,100,200,1.0) }
  .node:hover { opacity : .9 }
  .link { stroke:rgba(100,200,250,0.5); stroke-width:4 }
  .label { font: bold 10px monospace, sans-serif; color: grey; user-select: none;  }
  `],
  template: `
  <svg id="lesvg" #lesvg
  			(mouseup)="mouseup($event)"
  			(mousemove)="mousemove($event)">
  	<ng-container *ngFor="let link of w.node_links; let i = index">
  		<line class="link"
  			[attr.data-index]="i"
  			[attr.x1]="getViewX(link.to)"
  			[attr.y1]="getViewY(link.to)"
  			[attr.x2]="getViewX(link.from)"
  			[attr.y2]="getViewY(link.from)"
  			/>
  	</ng-container>
  	<ng-container *ngFor="let node of w.nodes; let i = index">
  		<circle class="node"
  			[attr.data-index]="i"
  			[attr.cx]="getViewX(node)"
  			[attr.cy]="getViewY(node)"
  			[attr.r]="16"
  			(mousedown)="mousedown($event)"
  			/>
  		<text
  			[attr.x]="getViewX(node)"
  			[attr.y]="getViewY(node) + 24"
  			class="label">{{node.id}}</text>
  	</ng-container>
	</svg>`
})
export class EditorViewChild_Map
{
  w = null;

  offsetX = 0;
  offsetY = 0;

  draggy = null;

  constructor()
  {
    this.w = require('./../game/mock-world.3.json');
  }

  getNodeByID( id )
  {
  	for ( let node of this.w.nodes )
  		if ( node.id == id )
  			return node
  	console.error(id + " missing",this.w.nodes)
  	return null
  }

  getViewX( o )
  {
  	if ( typeof o === 'string' || o instanceof String )
  		o = this.getNodeByID(o)
  	if ( o == null )
  		return 0;
  	return o.loc_x + this.offsetX;
  }

  getViewY( o )
  {
  	if ( typeof o === 'string' || o instanceof String )
  		o = this.getNodeByID(o)
  	if ( o == null )
  		return 0;
  	return o.loc_y + this.offsetY;
  }

  mousemove(e)
  {
  	if ( e.buttons > 0 )
  	{
			if ( this.draggy )
			{
				this.draggy.loc_x = e.x - this.offsetX;
				this.draggy.loc_y = e.y - this.offsetY;
			}
			else
			{
				this.offsetX += e.movementX;
				this.offsetY += e.movementY;
			}
  	}
  	else
  	{
	  	this.draggy = null;
  	}
  }

  mousedown(e)
  {
  	let node_id = +e.target.attributes['data-index'].value
  	this.draggy = this.w.nodes[node_id];
  	// this.log(node_id)
  }

  mouseup(e)
  {
  	this.draggy = null;
  	// console.log(JSON.stringify(this.w))
  }

  log(o) { console.log(o) }
}
