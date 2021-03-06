import { Component, ViewChild, ElementRef } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';
import { LocationNode } from '../types/data-models';
import { WorldMapWrapper } from '../util/world-map-wrapper';
import { ToastrService } from 'ngx-toastr';

@Component({ selector:'map-pane', templateUrl:`map-pane.component.html`, styleUrls:[`map-pane.component.css`] })
export class MapPaneComponent
{
  w:WorldMapWrapper

  offsetX:number = 0
  offsetY:number = 0
  zoom:number = 1.0

  mouseX:number = 0
  mouseY:number = 0

  panning:boolean = false
  dragging:LocationNode = null
  linking:LocationNode = null
  focused:LocationNode = null

  @ViewChild("lesvg") svg:ElementRef;

  constructor( private selection:SelectionService, world:WorldDataService, uidgen:UID_GenerationService,
               private toastr:ToastrService )
  { this.w = new WorldMapWrapper( world.data, uidgen ) }

  public get selected():any { return this.selection.selectedObject }
  public set selected( o:any ) { this.selection.selectObject( o ) }

  public get centerX():number { return this.svg.nativeElement.clientWidth * .5 }
  public get centerY():number { return this.svg.nativeElement.clientHeight * .5 }

  globalizeViewX( o ) { try { return ( o + this.offsetX ) * this.zoom + this.centerX } catch(e) { return 0 } }
  globalizeViewY( o ) { try { return ( o + this.offsetY ) * this.zoom + this.centerY } catch(e) { return 0 } }

  getViewX( o ) { try { return this.globalizeViewX( this.w.getNodeOrSubnode(o).x ) } catch(e) { return 0 } }
  getViewY( o ) { try { return this.globalizeViewY( this.w.getNodeOrSubnode(o).y ) } catch(e) { return 0 } }

  onkey( e:KeyboardEvent )
  {
    console.log(e)
    if( e.keyCode === 46 && this.selected )
    {
      this.selected = null
      this.w.removeNode(this.selected)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  mousewheel( e:WheelEvent )
  {
    let delta = e.wheelDelta > 0 ? 1.25 : 1.0/1.25;
    this.zoom *= delta
    if ( this.zoom > .99 && this.zoom < 1.01 )
      this.zoom = 1.00
  }

  mousemove(e:MouseEvent)
  {
    try {
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
    catch(e) { this.toastr.error(e) }
  }

  click_node(e:MouseEvent,node:LocationNode,isSubnode:boolean)
  {
    if ( e.buttons == 0 && e.button == 0 )
      this.selected = this.selected == node ? null : node
  }

  mousedown_node(e:MouseEvent,node:LocationNode,isSubnode:boolean)
  {
    if ( e.button == 0 )
      this.dragging = node
    else
    if ( e.button == 2 && !isSubnode )
  	  this.linking = node
  }

  mouseup_node(e:MouseEvent,node:LocationNode,isSubnode:boolean)
  {
    if (this.linking && this.linking != node)
      this.w.addLink(this.linking.uid, node.uid);
    this.linking = null
  }

  click_link(e:MouseEvent,from:LocationNode,to:string)
  {
    if ( e.button == 2 )
    {
  		this.w.removeLink( from, to )
      e.stopPropagation()
    }
  	this.linking = null
  }

  mouseup_trash(e:MouseEvent)
  {
  	if ( this.dragging != null )
  		this.w.removeNode(this.dragging)
  	this.dragging = null
  }

  mousedown(e:MouseEvent)
  {
    this.panning = e.button == 0 && e.buttons <= 1
  }

  mouseup(e:MouseEvent)
  {
    if ( this.selected && !this.dragging && e.buttons > 0 )
    {
      let prev:LocationNode = this.selected
      let x:number = ( this.mouseX - this.centerX ) / this.zoom-+ this.offsetX
      let y:number = ( this.mouseY - this.centerY ) / this.zoom-+ this.offsetY
      let askForName = !e.shiftKey && !e.ctrlKey
      let node = null

      if ( e.button == 0 && !prev.hasOwnProperty("parent") )
      {
        node =
        this.selected =
        this.w.addNode( x, y )
        if ( askForName )
          this.promptSetNodeName(node)
        this.w.addLink( node, prev )
        this.w.addLink( prev, node )
      }
      else
      if ( e.button == 2 )
      {
        node =
        this.w.addSubNode( x, y, prev )
        if ( askForName )
          this.promptSetNodeName(node)
      }
    }

  	this.dragging = null
  	this.linking = null
    this.panning = false
  }

  promptSetNodeName(node:LocationNode):void
  {
    let name = prompt("What would you name this node?")
    if ( name )
    {
      let uid = name.toLowerCase().replace(/[^a-z0-9_\-]/gi,'');
      node.slug = name
      node.uid = "@"+uid
    }
  }

  contextmenu(e) { return false; }
  random(seed,max) { return ( seed * 16807 % 2147483647 ) % max  }

  get prettyZoom():string { return Math.round(this.zoom*100) + "%" }
}
