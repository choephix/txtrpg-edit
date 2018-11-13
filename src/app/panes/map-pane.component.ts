import { Component, ViewChild, ElementRef } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';
import { Node } from '../types/data-models';
import { WorldMapWrapper } from '../util/world-map-wrapper';

@Component({ selector: 'map-pane', templateUrl: `map-pane.component.html` })
export class MapPaneComponent
{
  w:WorldMapWrapper

  offsetX:number = 0
  offsetY:number = 0
  zoom:number = 1.0

  mouseX:number = 0
  mouseY:number = 0

  panning:boolean = false
  dragging:Node = null
  linking:Node = null
  focused:Node = null

  @ViewChild("lesvg") svg:ElementRef;

  constructor( private el:ElementRef, private world:WorldDataService, private selection:SelectionService, uidgen:UID_GenerationService )
  {
  	this.w = new WorldMapWrapper( world.data, uidgen )
  }

  public get selected():any { return this.selection.selectedObject }
  public set selected( o:any ) { this.selection.selectObject( o ) }

  public get centerX():number { return this.svg.nativeElement.clientWidth * .5 }
  public get centerY():number { return this.svg.nativeElement.clientHeight * .5 }

  globalizeViewX( o ) {
    // console.log( ( o + this.offsetX ) * this.zoom + this.centerX )
    // return ( o + this.offsetX ) * this.zoom + this.centerX
    try { return ( o + this.offsetX ) * this.zoom + this.centerX }
    catch(e) { return 0 }
  }
  globalizeViewY( o ) {
    // console.log( ( o + this.offsetY ) * this.zoom + this.centerY )
    try { return ( o + this.offsetY ) * this.zoom + this.centerY }
    catch(e) { return 0 }
  }

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

  click_node(e,node:Node,isSubnode:boolean)
  {
    console.dir(this.svg.nativeElement )
    console.dir(this.svg.nativeElement.getBoundingClientRect() )
    console.dir(this.svg.nativeElement.offsetWidth )
    console.dir(this)
    console.dir(document)
    if ( e.buttons == 0 && e.button == 0 )
      this.selected = this.selected == node ? null : node
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
  }

  mouseup_link(e,link_index)
  {
    if ( e.button == 2 )
    {
  		this.w.removeLink( link_index )
      e.stopPropagation()
    }
  	this.linking = null
  }

  mouseup_trash(e)
  {
  	if ( this.dragging != null )
  		this.w.removeNode(this.dragging)
  	this.dragging = null
  }

  mousedown(e)
  {
    this.panning = e.button == 0 && e.buttons <= 1
  }

  mouseup(e)
  {
    if ( this.selected && !this.dragging && e.buttons > 0 )
    {
      let prev:Node = this.selected
      let x:number = ( this.mouseX - this.centerX ) / this.zoom-+ this.offsetX
      let y:number = ( this.mouseY - this.centerY ) / this.zoom-+ this.offsetY

      if ( e.button == 0 && !prev.hasOwnProperty("parent") )
      {
        let node =
        this.selected =
        this.w.addNode( x, y )
        this.w.addLink( node, prev )
        this.w.addLink( prev, node )
      }
      else
      if ( e.button == 2 )
      {
        this.w.addSubNode( x, y, prev )
      }
    }

  	this.dragging = null
  	this.linking = null
    this.panning = false
  }

  contextmenu(e) { return false; }
  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }
  log(o) { console.log(o) }

  get prettyZoom():string { return Math.round(this.zoom*100) + "%" }
}
