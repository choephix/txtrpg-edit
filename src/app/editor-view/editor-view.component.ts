import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalWorldDataService } from './../editor/global-world-data.service';

declare var angular: any;

@Component({ templateUrl: './editor-view.component.html' })
export class EditorVewComponent
{
	pages:string[] = []
	branch:string

  constructor( public router:Router, private route:ActivatedRoute, public world:GlobalWorldDataService )
  {
    this.route.paramMap.subscribe( params => {
    	this.branch = params.get("branch")
    	if ( !this.branch )
    		console.warn("no branch?",params)
    	else
    		world.load(this.branch)
    } );

  	console.log( router.config )
		for ( const r of router.config )
			if ( r.path === ":branch/edit" )
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
  styles: [`#table { height:95vh; width:100%; }`],
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

  constructor( public world:GlobalWorldDataService ) { this.gitbub = world.bub }

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
  public get worldData() { return this.gitbub.data }

  public columnDefs = [
      { editable:true, field: 'from' , headerName: 'from', suppressSizeToFit:true },
      { editable:true, field: 'to', headerName: 'to', suppressSizeToFit:true },
      { editable:true, field: 'flags', headerName: 'flags', suppressSizeToFit:true },
      { editable:true, field: 'handle', headerName: 'handle', autoHeight: true },
      { editable:true, field: 'text', headerName: 'text', autoHeight: true }
  ];

	private gitbub

  constructor( public world:GlobalWorldDataService )
  { this.gitbub = world.bub }

  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights()
  }
}

export class WorldMapData
{
  public get w() { return this.gitbub.data }

	private gitbub = null;

  constructor(gitbub)
  {
    this.gitbub = gitbub;
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