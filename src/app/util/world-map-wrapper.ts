import { WorldData, LocationNode, LocationSubnode, Link } from './../types/data-models'
import { UID_GenerationService } from '../services/id-gen.service';

export class WorldMapWrapper
{
  constructor( private data, private uidgen:UID_GenerationService ) { }

  public get w():WorldData { return this.data.world }

  public get nodes():LocationNode[] { return this.data.world.nodes }
  public get subnodes():LocationSubnode[] { return this.data.world.subnodes }
  public get links():Link[] { return this.data.world.links }

  getNodeOrSubnode( o ):LocationNode
  {
    if (typeof o === 'string' || o instanceof String) {
      for (let node of this.w.nodes)
        if ( node.uid == o || node.slug == o )
          return node
	  	for ( let node of this.w.subnodes )
	  		if ( node.uid == o || node.slug == o )
	  			return node
    }
  	if ( o.hasOwnProperty("uid") )
  		return o;
  	console.error( `${o} missing`,this.w.nodes)
  }

  addNode(x,y):LocationNode
  {
    let slug = `node_${this.w.nodes.length}`
    let uid = this.uidgen.make(8)
  	let node = { slug:slug,uid:uid,x:x,y:y }
		this.w.nodes.push(node)
		return node
  }

  addSubNode(x, y, parent):LocationSubnode
  {
    let slug = `node_${this.w.nodes.length}`
    let uid = this.uidgen.make(8)
    let subnode = { slug:slug,uid:uid,parent:parent.uid,x:x,y:y }
		this.w.subnodes.push(subnode)
		return subnode
  }

  addLink(from,to):Link
  {
  	let from_node = this.getNodeOrSubnode(from)
  	let to_node = this.getNodeOrSubnode(to)
  	let link = {
  		from:from_node.uid,
  		to:to_node.uid,
  	}
  	this.w.links.push(link)
  	return link
  }

  removeNode( node:LocationNode|LocationSubnode ):void
  {
		let links = this.w.links
		for ( let i = links.length - 1; i >= 0; i-- )
			if ( links[i].to == node.uid || links[i].from == node.uid )
				this.removeLink( i )
		let subs = this.w.subnodes
		for ( let i = subs.length - 1; i >= 0; i-- )
			if ( subs[i].parent == node.uid )
				this.removeNode( subs[i] )
    let i: number
    i = this.w.nodes.indexOf(node)
    if (i >= 0)
      this.w.nodes.splice(i, 1)
    i = this.w.subnodes.indexOf(<LocationSubnode>node)
    if (i >= 0)
      this.w.subnodes.splice(i, 1)
  }

  removeLink( link_index ):void
  {
  	this.w.links.splice( link_index, 1 )
  }
}
