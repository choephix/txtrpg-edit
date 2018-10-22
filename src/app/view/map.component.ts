import { Component } from '@angular/core';
import { WorldMapWrapper } from './../util/world-map-wrapper';
import { WorldDataService } from './../services/world-data.service';
import { SelectionService } from './../services/selection.service';
import { WorldData, Node, Subnode, Link } from './../types/data-models'

@Component({ templateUrl: `map.component.html` })
export class EditorViewChild_Map
{
  w:WorldMapWrapper

  offsetX = 0
  offsetY = 0

  dragging:Node = null
  linking:Node = null
  panning:boolean = false

  mouseX = 0
  mouseY = 0

  getViewX( o ) { return this.w.getNodeOrSubnode(o).loc_x + this.offsetX }
  getViewY( o ) { return this.w.getNodeOrSubnode(o).loc_y + this.offsetY }

  constructor( public world:WorldDataService, public selection:SelectionService )
  {
  	this.w = new WorldMapWrapper(world.data)
  	this.selection.callbacks_OnModify.push( new_o => this.onDataWillBeModified(new_o) )
  }

  public get selected():any { return this.selection.selectedObject }
  public set selected( o:any ) { this.selection.selectObject( o ) }

  onDataWillBeModified( new_o )
  {
    const old_o = this.selection.selectedObject
    const old_id = old_o.id
    console.log("MODI",new_o,old_o)
    for ( const link of this.w.links )
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
	  this.mouseX = e.offsetX
	  this.mouseY = e.offsetY

  	if ( this.linking )
  		return

    if ( this.dragging )
    {
      this.dragging.loc_x = e.offsetX - this.offsetX
      this.dragging.loc_y = e.offsetY - this.offsetY
    }
    else
    if ( this.panning )
    {
      this.offsetX += e.movementX
      this.offsetY += e.movementY
    }
  }

  mousedown_node(e,node:Node,isSubnode:boolean)
  {
    if ( e.button == 0 )
      this.dragging = node
    else
    if ( e.button == 2 && !isSubnode )
  	  this.linking = node
  }

  mouseup_node(e,node:Node,isSubnode:boolean)
  {
    if (this.linking && this.linking != node)
      this.w.addLink(this.linking.id, node.id);
    this.linking = null

  	if ( e.button == 1 && !isSubnode )
    {
  		let new_node =
  		this.w.addNode( node.loc_x + Math.random() * 96,
  		  							node.loc_y - Math.random() * 96)
  		this.w.addLink( node, new_node )
  		this.w.addLink( new_node, node )
    }
    else
  	if ( e.button == 2 )
  	{
  		let new_node =
  		this.w.addSubNode( node.loc_x + Math.random() * 96,
  		  							   node.loc_y - Math.random() * 96,
                         node )
    }
    // e.stopPropagation()
  }

  mouseup_link(e,link_index)
  {
  	if ( e.button == 2 )
  		this.w.removeLink( link_index )
  	this.linking = null
  	e.stopPropagation()
  }

  mouseup_trash(e)
  {
  	if ( this.dragging != null )
  		this.w.removeNode(this.dragging)
  	this.dragging = null
  }

  mousedown(e)
  {
    if (e.button == 0)
      this.panning = true
  }

  mouseup(e)
  {
  	this.dragging = null
  	this.linking = null
    this.panning = false
  }

  contextmenu(e) { return false; }
  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }
  log(o) { console.log(o) }
}
