import { WorldData, LocationNode, LocationSubnode } from './../types/data-models'
import { UID_GenerationService } from '../services/id-gen.service';

export class WorldMapWrapper
{
  constructor( private data, private uidgen:UID_GenerationService ) { }

  public get w():WorldData { return this.data.world }

  public get nodes():LocationNode[] { return this.data.world.locations }
  public get subnodes():LocationSubnode[] { return this.data.world.subnodes }

  getNodeOrSubnode( o ):LocationNode
  {
    if (typeof o === 'string' || o instanceof String) {
      for (let node of this.w.locations)
        if ( node.uid == o || node.slug == o )
          return node
	  	for ( let node of this.w.subnodes )
	  		if ( node.uid == o || node.slug == o )
	  			return node
    }
  	if ( o.hasOwnProperty("uid") )
  		return o;
  	console.error( `${o} missing`,this.w.locations)
  }

  makeNode(x,y):any
  {
    let uid = this.uidgen.make(8)
  	let node = { slug:uid,uid:"@"+uid,x:x,y:y }
    return node
  }

  addNode(x,y):LocationNode
  {
  	let node = this.makeNode(x,y)
		this.w.locations.push( node )
		return node
  }

  addSubNode(x, y, parent):LocationSubnode
  {
    let subnode = this.makeNode(x,y)
    subnode.parent = parent
		this.w.subnodes.push(subnode)
		return subnode
  }

  addLink(from,to)
  {
  	let from_node = this.getNodeOrSubnode(from)
    from_node.exits.push(to)
  }

  removeNode( node:LocationNode|LocationSubnode ):void
  {
		let subs = this.w.subnodes
		for ( let i = subs.length - 1; i >= 0; i-- )
			if ( subs[i].parent == node.uid )
				this.removeNode( subs[i] )
    let i: number
    i = this.w.locations.indexOf(node)
    if (i >= 0)
      this.w.locations.splice(i, 1)
    i = this.w.subnodes.indexOf(<LocationSubnode>node)
    if (i >= 0)
      this.w.subnodes.splice(i, 1)
  }

  removeLink( node:LocationNode, to:string ):void
  {
  	node.exits.splice( node.exits.indexOf(to), 1 )
  }
}
