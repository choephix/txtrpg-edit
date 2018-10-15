import { Component } from '@angular/core';
import { WorldMapData } from './editor-view.component';

@Component({ templateUrl: `editor-view-map.component.html` })
export class EditorViewChild_Map
{
  w:WorldMapData = new WorldMapData();

  offsetX = 0;
  offsetY = 0;

  draggy = null;
  linking = false;

  mouseX = 0;
  mouseY = 0;

  getViewX( o ) { return this.w.getNode(o).loc_x + this.offsetX }
  getViewY( o ) { return this.w.getNode(o).loc_y + this.offsetY }

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
  	let node_index = +e.target.attributes['data-index'].value
  	this.draggy = this.w.getNode(node_index);
  	this.linking = e.button == 2;
  }

  mouseup_node(e)
  {
  	let node_index = +e.target.attributes['data-index'].value
  	let node = this.w.getNode(node_index)

  	if ( this.linking )
  		if ( this.draggy != null )
  			this.w.addLink(this.draggy.id,node.id);
  		else
  			return

  	if ( e.button == 1 )
  	{
  		let new_node =
  		this.w.addNode( node.loc_x + Math.random() * 96,
  		  							node.loc_y - Math.random() * 96)
  		this.w.addLink( node, new_node )
  		this.w.addLink( new_node, node )
  	}
  }

  mouseup_link(e)
  {
  	if ( e.button == 2 )
  		this.w.removeLink( +e.target.attributes['data-index'].value )
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
	  // console.log(e)
  	if ( e.button == 1 )
  	  console.log(JSON.stringify(this.w))
  }

  contextmenu(e) { return false; }
  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }
  log(o) { console.log(o) }
}