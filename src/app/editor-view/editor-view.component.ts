import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalWorldDataService } from './../editor/global-world-data.service';

@Component({ templateUrl: './editor-view.component.html' })
export class EditorVewComponent
{
	pages:string[] = []

  constructor( public router: Router, private http:HttpClient, public world:GlobalWorldDataService )
  {
		for ( const r of router.config )
			if ( r.path === "edit" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(e:KeyboardEvent) {
  	if ( e.keyCode == 19 && e.ctrlKey && e.shiftKey )
    	this.world.save()
    else
    	console.log(e)
    e.preventDefault();
    e.stopPropagation();
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

  constructor( public world:GlobalWorldDataService )
  { this.worldData = world.bub.data }

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
	    [rowData]="worldData.text_node_links"
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
      { editable:true, field: 'flags', headerName: 'flags', suppressSizeToFit:true },
      { editable:true, field: 'handle', headerName: 'handle', autoHeight: true },
      { editable:true, field: 'text', headerName: 'text', autoHeight: true }
  ];

  constructor( public world:GlobalWorldDataService )
  { this.worldData = world.bub.data }

  onGridReady(params)
  {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights()
  }
}

export class WorldMapData
{
  w = null;

  constructor(data)
  {
    this.w = data;
    // for ( let node of this.w.nodes ) node.loc_x -=500

    // this.w.text_links = []
    // for ( let link of this.w.node_links )
    // {
    // 	delete link.handle_goto;
    // 	delete link.handle_gobackto;

    // 	this.w.text_links.push({
    // 		from: link.from, to: link.to, flags: [],
    // 		handle: `Go to ${link.to}`,
    // 		text: `I went to ${link.to}`
    // 	})
    // 	this.w.text_links.push({
    // 		from: link.from, to: link.to, flags: ['back'],
    // 		handle: `Go back to ${link.to}`,
    // 		text: `I went returned to ${link.to}`
    // 	})
    // }
    // console.log(JSON.stringify(this.w))
  }

  getNode( o )
  {
  	if ( typeof o === 'string' || o instanceof String )
	  	for ( let node of this.w.nodes )
	  		if ( node.id == o )
	  			return node
  	if ( o.hasOwnProperty("id") )
  		return o;
	  return this.w.nodes[o]
  	// console.error( `${o} missing`,this.w.nodes)
  }

  getNodeIndex( o )
  {
  	let nodes = this.w.nodes;
  	for ( let i in nodes )
  		if ( nodes[i] == o || nodes[i].id == o )
  			return i
  }

  addNode(x,y)
  {
		let new_id = `node_${this.w.nodes.length}`
		let title = new_id
  	let node = {
			id:new_id,
			title:title,
			loc_x:x,
			loc_y:y,
		}
		this.w.nodes.push(node)
		return node
  }

  addLink(from,to)
  {
  	let from_node = this.getNode(from)
  	let to_node = this.getNode(to)
  	let link = {
  		from:from_node.id,
  		to:to_node.id,
  		handle_goto:`Go to ${to_node.title}`,
  		handle_gobackto:`Return to ${to_node.title}`,
  	}
  	this.w.node_links.push(link)
  	return link
  }

  removeNode( node_index )
  {
  	let node = this.w.nodes[node_index]
		let links = this.w.node_links
		for ( let i = links.length - 1; i >= 0; i-- )
			if ( links[i].to == node.id || links[i].from == node.id )
				this.removeLink( i )
		this.w.nodes.splice(node_index, 1)
  }

  removeLink( link_index )
  {
  	this.w.node_links.splice( link_index, 1 )
  }
}