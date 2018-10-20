
export class WorldMapWrapper
{
  public get w() { return this.gitbub.data }

	private gitbub = null;

  constructor(gitbub)
  {
    this.gitbub = gitbub;
    // for ( let node of this.w.nodes ) node.loc_x -=500

    // this.w.text_links = []
    // for ( let link of this.w.node_links )
    // {
    // 	delete link.handle_goto;
    // 	delete link.handle_gobackto;

    // 	this.w.text_links.push({
    // 		from: link.from, to: link.to, flags: [],
    // 		handle: `Go to ${link.to}`,
    // 		text: `I went to ${link.to}`
    // 	})
    // 	this.w.text_links.push({
    // 		from: link.from, to: link.to, flags: ['back'],
    // 		handle: `Go back to ${link.to}`,
    // 		text: `I went returned to ${link.to}`
    // 	})
    // }
    // console.log(JSON.stringify(this.w))
  }

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
			title:title,
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
  		handle_goto:`Go to ${to_node.title}`,
  		handle_gobackto:`Return to ${to_node.title}`,
  	}
  	this.w.node_links.push(link)
  	return link
  }

  removeNode( node_index )
  {
  	let node = this.w.nodes[node_index]
		let links = this.w.node_links
		for ( let i = links.length - 1; i >= 0; i-- )
			if ( links[i].to == node.id || links[i].from == node.id )
				this.removeLink( i )
		this.w.nodes.splice(node_index, 1)
  }

  removeLink( link_index )
  {
  	this.w.node_links.splice( link_index, 1 )
  }
}
