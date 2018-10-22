import { WorldData, Node, Subnode, Link } from './../types/data-models'

export class WorldMapWrapper
{
  constructor( private data ) { }

  public get w() { return this.data.world }

  public get nodes():any[] { return this.data.world.nodes }
  public get subnodes():any[] { return this.data.world.subnodes }
  public get links():any[] { return this.data.world.links }

  getNodeOrSubnode( o )
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
  	let node = {
			id:new_id,
			loc_x:x,
			loc_y:y,
		}
		this.w.nodes.push(node)
		return node
  }

  addSubNode(x, y, parent)
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

  addLink(from,to)
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

  removeNode( node_index )
  {
  	let node = this.w.nodes[node_index]
		let links = this.w.links
		for ( let i = links.length - 1; i >= 0; i-- )
			if ( links[i].to == node.id || links[i].from == node.id )
				this.removeLink( i )
		this.w.nodes.splice(node_index, 1)
  }

  removeLink( link_index )
  {
  	this.w.links.splice( link_index, 1 )
  }
}
