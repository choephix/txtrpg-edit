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
  #trash { fill:rgba(255,0,0,.05); }
  #trash:hover { fill:rgba(255,0,0,.25); stroke:rgba(255,0,0,.1); stroke-width:4 }
  .node { stroke:rgba(100,200,250,0.5); stroke-width:4; fill:rgba(50,100,200,1.0) }
  .link { stroke:rgba(100,200,250,0.25); stroke-width:16 }
  .label { font: bold 10px monospace, sans-serif; color: grey; user-select: none;  }
  .node:hover { opacity : .9 }
  .link:hover { opacity : .7 }
  `],
  template: `
  <svg id="lesvg" #lesvg
  			(mouseup)="mouseup($event)"
  			(mousemove)="mousemove($event)"
  			(contextmenu)="contextmenu($event)">
  	<ng-container *ngFor="let link of w.node_links; let i = index">
  		<line
  			[attr.data-index]="i"
  			[attr.x1]="getViewX(link.to)+4"
  			[attr.y1]="getViewY(link.to)+random(i,8)"
  			[attr.x2]="getViewX(link.from)-4"
  			[attr.y2]="getViewY(link.from)-random(i,8)"
  			(mouseup)="mouseup_link($event)"
  			class="link"/>
  	</ng-container>
  	<ng-container *ngFor="let node of w.nodes; let i = index">
  		<circle
  			[attr.data-index]="i"
  			[attr.cx]="getViewX(node)"
  			[attr.cy]="getViewY(node)"
  			[attr.r]="16"
  			(mousedown)="mousedown_node($event)"
  			(mouseup)="mouseup_node($event)"
  			class="node"/>
  		<text
  			[attr.x]="getViewX(node)"
  			[attr.y]="getViewY(node) + 24"
  			class="label">{{node.id}}</text>
  	</ng-container>
  	<circle cx="94vw" cy="12vw" r=32 id="trash" (mouseup)="mouseup_trash($event)">
  	</circle>
	</svg>`
})
export class EditorViewChild_Map
{
  w = null;

  offsetX = 0;
  offsetY = 0;

  draggy = null;
  linking = false;

  constructor()
  {
    this.w = require('./../game/mock-world.3.json');
    // for ( let node of this.w.nodes ) node.loc_x -=500
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
  	if ( this.linking )
  		return

  	if ( e.buttons > 0 && e.button == 0 )
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

  mousedown_node(e)
  {
  	let node_id = +e.target.attributes['data-index'].value
  	this.draggy = this.w.nodes[node_id];
  	this.linking = e.button == 2;
  }

  mouseup_node(e)
  {
  	let node_index = +e.target.attributes['data-index'].value
  	let node = this.w.nodes[node_index]

  	if ( this.linking )
  	{
  		if ( this.draggy != null )
  			this.w.node_links.push({from:this.draggy,to:node.id,
  															handle_goto:`Go to ${node.title}`,handle_gobackto:``})
  	}
  	else
  	if ( e.button == 1 )
  	{
  		let new_id = `node_${this.w.nodes.length}`
  		let title = new_id
  		this.w.nodes.push({
  			id:new_id,
  			title:title,
  			loc_x:node.loc_x + Math.random() * 64,
  			loc_y:node.loc_y - Math.random() * 64,
  		})
  		this.w.node_links.push({from:new_id,to:node.id,handle_goto:`Go to ${title}`,handle_gobackto:``})
  		this.w.node_links.push({from:node.id,to:new_id,handle_goto:`Go to ${node.title}`,handle_gobackto:``})
  	}

  	// console.log(e)
  	// console.log(this.draggy)
  	// this.log(node_id)
  }

  mouseup_link(e)
  {
  	if ( e.button == 2 )
  	{
	  	let link_index = +e.target.attributes['data-index'].value
	  	this.w.node_links.splice( link_index, 1 )
  	}
  }

  mouseup_trash(e)
  {
  	if ( this.draggy != null )
  	{
	  	let node = this.draggy
	  	let node_index = this.w.nodes.indexOf(node)

  		this.w.nodes.splice(node_index, 1)
  		let links = this.w.node_links
  		for ( let i = links.length - 1; i >= 0; i-- )
  			if ( links[i].to == node.id || links[i].from == node.id )
  				this.w.node_links.splice( i, 1 )
  	}

  	this.draggy = null;
  }

  mouseup(e)
  {
  	this.draggy = null;
	  // console.log(e)

  	if ( e.button == 1 )
  	  console.log(JSON.stringify(this.w))
  }

  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }

  contextmenu(e) { return false; }

  log(o) { console.log(o) }
}
