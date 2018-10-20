import { Component } from '@angular/core';
import { WorldMapData } from './editor-view.component';
import { WorldDataService } from './../editor/world-data.service';
import { SelectionService } from './../editor/selection.service';

@Component({ templateUrl: `editor-view-map.component.html` })
export class EditorViewChild_Map
{
  w:WorldMapData

  offsetX = 0
  offsetY = 0

  selectedNode:number|null = null
  selectedLink:number|null = null

  draggy = null
  linking = false

  mouseX = 0
  mouseY = 0

  getViewX( o ) { return this.w.getNode(o).loc_x + this.offsetX }
  getViewY( o ) { return this.w.getNode(o).loc_y + this.offsetY }

  constructor( public world:WorldDataService, public selection:SelectionService )
  {
  	this.w = new WorldMapData(world)
  	this.selection.callbacks_OnModify.push( new_o => this.onDataWillBeModified(new_o) )
  }

  onDataWillBeModified( new_o )
  {
    const old_o = this.selection.selectedObject
    const old_id = old_o.id
    console.log("MODI",new_o,old_o)
    for ( const link of this.w.w.node_links )
    {
      if ( link.from == old_id )
        link.from = new_o.id
      else
      if ( link.to == old_id )
        link.to = new_o.id
    }
  }

  mousemove(e)
  {
	  this.mouseX = e.x;
	  this.mouseY = e.y;
	  
  	if ( this.linking )
  		return

  	if ( e.buttons > 0 && e.button == 0 )
  	{
			if ( this.draggy )
			{
				this.draggy.loc_x = e.offsetX - this.offsetX;
				this.draggy.loc_y = e.offsetY - this.offsetY;
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
  	let node_index = +e.target.attributes['data-index'].value
  	this.draggy = this.w.getNode(node_index);
  	this.linking = e.button == 2;
  }

  mouseup_node(e)
  {
  	let node_index = +e.target.attributes['data-index'].value
  	let node = this.w.getNode(node_index)

  	if ( this.linking )
  	{
  		if ( this.draggy != null )
  			this.w.addLink(this.draggy.id,node.id);
  		else
  			return
  		this.linking = false
  	}

  	if ( e.button == 1 )
  	{
  		let new_node =
  		this.w.addNode( node.loc_x + Math.random() * 96,
  		  							node.loc_y - Math.random() * 96)
  		this.w.addLink( node, new_node )
  		this.w.addLink( new_node, node )
  	}
  	else
  	if ( e.button == 0 )
  		this.selectNode( node_index )
  	e.stopPropagation()
  }

  mouseup_link(e)
  {
  	let link_id = +e.target.attributes['data-index'].value
  	if ( e.button == 2 )
  		this.w.removeLink( link_id )
  	else
  	if ( e.button == 0 )
  		this.selectLink( link_id )
  	this.linking = false
  	e.stopPropagation()
  }

  selectLink( i )
  {
  	console.log(i)
  	this.selectedNode = null
  	this.selectedLink = i
  }

  selectNode( i )
  {
  	console.log(i)
  	this.selectedLink = null
  	this.selectedNode = i
    this.selection.selectObject( this.w.w.nodes[i] );
  }

  mouseup_trash(e)
  {
  	if ( this.draggy != null )
  		this.w.removeNode(this.w.getNodeIndex(this.draggy))
  	this.draggy = null;
  }

  mouseup(e)
  {
  	this.draggy = null;
  	this.linking = false;

  	this.selectedNode = null
  	this.selectedNode = null

	  // console.log(e)
  	if ( e.button == 1 )
  	  console.log(JSON.stringify(this.w.w))
  }

  contextmenu(e) { return false; }
  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }
  log(o) { console.log(o) }
}