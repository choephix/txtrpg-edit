import { WorldData, Node, Subnode, Link } from './../types/data-models'

export class WorldMapWrapper
{
  constructor( private data ) { }

  public get w():WorldData { return this.data.world }

  public get nodes():Node[] { return this.data.world.nodes }
  public get subnodes():Subnode[] { return this.data.world.subnodes }
  public get links():Link[] { return this.data.world.links }

  getNodeOrSubnode( o ):Node
  {
    if (typeof o === 'string' || o instanceof String) {
      for (let node of this.w.nodes)
        if (node.id == o)
          return node
	  	for ( let node of this.w.subnodes )
	  		if ( node.id == o )
	  			return node
    }
  	if ( o.hasOwnProperty("id") )
  		return o;
  	console.error( `${o} missing`,this.w.nodes)
  }

  addNode(x,y):Node
  {
		let new_id = `node_${this.w.nodes.length}`
  	let node = {
			id:new_id,
			loc_x:x,
			loc_y:y,
		}
		this.w.nodes.push(node)
		return node
  }

  addSubNode(x, y, parent):Subnode
  {
		let new_id = `subnode_${this.w.subnodes.length}`
  	let node = {
			id:new_id,
			loc_x:x,
			loc_y:y,
      parent:parent.id
		}
		this.w.subnodes.push(node)
		return node
  }

  addLink(from,to):Link
  {
  	let from_node = this.getNodeOrSubnode(from)
  	let to_node = this.getNodeOrSubnode(to)
  	let link = {
  		from:from_node.id,
  		to:to_node.id,
  	}
  	this.w.links.push(link)
  	return link
  }

  removeNode( node:Node|Subnode ):void
  {
		let links = this.w.links
		for ( let i = links.length - 1; i >= 0; i-- )
			if ( links[i].to == node.id || links[i].from == node.id )
				this.removeLink( i )
		let subs = this.w.subnodes
		for ( let i = subs.length - 1; i >= 0; i-- )
			if ( subs[i].parent == node.id )
				this.removeNode( subs[i] )
    let i: number
    if ( node instanceof Node )
    {
      i = this.w.nodes.indexOf(node)
      if (i >= 0) {
        this.w.nodes.splice(i, 1)
      }
    }
    else
    {
      i = this.w.subnodes.indexOf(<Subnode>node)
      if (i >= 0) {
        this.w.subnodes.splice(i, 1)
      }
    }
    console.error("Can't find node I was supposed to remove...")
  }

  removeLink( link_index ):void
  {
  	this.w.links.splice( link_index, 1 )
  }
}
