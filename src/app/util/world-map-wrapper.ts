
export class WorldMapWrapper
{
  constructor( private data ) { }

  public get w() { return this.data.world }

  public get nodes():any[] { return this.data.world.nodes }
  public get subnodes():any[] { return this.data.world.subnodes }
  public get links():any[] { return this.data.world.links }

  getNode( o )
  {
  	if ( typeof o === 'string' || o instanceof String )
	  	for ( let node of this.w.nodes )
	  		if ( node.id == o )
	  			return node
  	if ( o.hasOwnProperty("id") )
  		return o;
	  return this.w.nodes[o]
  	// console.error( `${o} missing`,this.w.nodes)
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
		let title = new_id
  	let node = {
			id:new_id,
			loc_x:x,
			loc_y:y,
		}
		this.w.nodes.push(node)
		return node
  }

  addLink(from,to)
  {
  	let from_node = this.getNode(from)
  	let to_node = this.getNode(to)
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
