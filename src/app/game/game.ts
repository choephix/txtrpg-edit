declare var require:any

export class Game 
{
  public worldData = null;

  public journal:string[] = [];
  public options:Option[] = [];
  
  public context = {}

  private actionHandler:ActionHandler = new ActionHandler();
  
  public onChange:()=>void;

  public start():void
  {
    this.worldData = require('./mock-world.json');

    const start_node = this.worldData.start.node;
    this.go( {action:"goto", node:start_node, pre:"I woke up."} );
  }

  public go( action ):void
  {
    this.options = []
    
    const result = this.actionHandler.handleAction( action, this.worldData );
    this.journal.push(result.journal_entry);
    this.options = result.options;
    
    try { this.onChange() }
    catch( e ) { console.log("onchange errorred")}
  }

  public selectOption(index:number):void
  {
    console.log(`Selected Option [${index}]`);

    this.go( this.options[index].pa );
  }

  // public getCurrentNode() { return this.worldData.nodes[0].title }
  public getCurrentNode() { return "unknown location" }
  public getTime() { return this.worldData.global.time }
}

class Context
{
  currentNode:string
}

class ActionHandler
{
  public handleAction( params, world ):ActionResult
  {
    console.log(`Handling Action Params `)
    console.log(params)

    const placeAliases = ( text:string ):string =>
    {
      const dict = world.aliases
      for ( const alias in dict )
        text = text.split(`<${alias}>`).join(dict[alias]);
      return text
    }

    const node = world.nodes[params.node]

    if ( params.action === "goto" )
    {
      const options = []
      for ( const exit of node.exits )
      {
        console.log(exit)
        options.push( { 
          t:placeAliases(exit.handle), 
          pa:{action:"goto",node:exit.node,pre:exit.on_go} } )
      }

      return {
        journal_entry : `${placeAliases(params.pre)}\nI was at ${placeAliases(node.title)}`,
        options: options
      }
    }
  }
}

class ActionResult
{
  journal_entry:string
  options:Option[]
}

class Option
{
  t:string
  pa:object
}


