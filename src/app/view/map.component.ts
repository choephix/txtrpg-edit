import { Component, ViewChild, ElementRef } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from './../services/selection.service';
import { WorldDataService } from './../services/world-data.service';
import { Node } from './../types/data-models';
import { WorldMapWrapper } from './../util/world-map-wrapper';

declare var angular:any

@Component({ templateUrl: `map.component.html` })
export class EditorViewChild_Map
{
  w:WorldMapWrapper

  offsetX:number = 0
  offsetY:number = 0
  zoom:number = 1.0

  mouseX:number = 0
  mouseY:number = 0

  dragging:Node = null
  linking:Node = null
  panning:boolean = false

  @ViewChild("lesvg") svg:ElementRef;

  constructor( private el:ElementRef, private world:WorldDataService, private selection:SelectionService, uidgen:UID_GenerationService )
  {
  	this.w = new WorldMapWrapper( world.data, uidgen )
  }

  public get selected():any { return this.selection.selectedObject }
  public set selected( o:any ) { this.selection.selectObject( o ) }

  public get centerX():number { return this.svg.nativeElement.clientWidth * .5 }
  public get centerY():number { return this.svg.nativeElement.clientHeight * .5 }

  getViewX( o ) {
    try { return ( this.w.getNodeOrSubnode(o).x + this.offsetX ) * this.zoom + this.centerX }
    catch(e) { return 0 }
  }
  getViewY( o ) {
    try { return ( this.w.getNodeOrSubnode(o).y + this.offsetY ) * this.zoom + this.centerY }
    catch(e) { return 0 }
  }

  mousewheel( e:WheelEvent )
  {
    let delta = e.wheelDelta > 0 ? 1.25 : 1.0/1.25;
    this.zoom *= delta
    if ( this.zoom > .99 && this.zoom < 1.01)
      this.zoom = 1.00
  }

  mousemove(e)
  {
	  this.mouseX = e.offsetX
	  this.mouseY = e.offsetY

  	if ( this.linking )
  		return

    if ( this.dragging )
    {
      // this.dragging.x = ( e.offsetX - this.offsetX )
      // this.dragging.y = ( e.offsetY - this.offsetY )
      this.dragging.x += e.movementX / this.zoom
      this.dragging.y += e.movementY / this.zoom
    }
    else
    if ( this.panning )
    {
      this.offsetX += e.movementX / this.zoom
      this.offsetY += e.movementY / this.zoom
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
      this.w.addLink(this.linking.uid, node.uid);
    this.linking = null

  	if ( e.button == 1 && !isSubnode )
    {
  		let new_node =
      this.selected = 
  		this.w.addNode( node.x + Math.random() * 96,
  		  							node.y - Math.random() * 96)
  		this.w.addLink( node, new_node )
  		this.w.addLink( new_node, node )
    }
    else
  	if ( e.button == 2 )
  	{
  		this.selected = 
  		this.w.addSubNode( node.x + Math.random() * 96,
  		  							   node.y - Math.random() * 96,
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
