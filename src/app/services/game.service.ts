import { Injectable, APP_INITIALIZER } from '@angular/core';
import { WorldDataService } from './world-data.service';
import { WorldMapWrapper } from '../util/world-map-wrapper';
import { Thread, ThreadStage, Interceptor, InterceptorWhen, InterceptorWhat, InterceptorChoice } from '../types/data-models';

@Injectable({providedIn: 'root'})
export class GameService
{
  journal:JournalEntry[]
  choices:Choice[]

  world:WorldMapWrapper
  me:Me
  threads:ActiveThread[]
  context

  constructor( private data:WorldDataService )
  {
    this.world = new WorldMapWrapper( data.data, null )
    this.start()
  }

  findBySlug<T>( slug:string, array:T[] ):T
  {
    for ( let o of array )
      if ( o.hasOwnProperty("slug") && o["slug"] === slug )
        return o
    return null
  }

  public start()
  {
    this.journal = []
    this.choices = []
    this.context = { n:0 }
    this.me = new Me()
    this.threads = []

    let code = `goto('${this.data.data.ini.spawn_node}')`
    let entry = `I spawned in the middle of somewhere.`
    let my_first_choice:Choice = new Choice( "...", 100, ()=> new Result( entry, code ) )
    this.handleChoice( my_first_choice )
  }

  public activateThread( slug:string ):void
  {
    this.threads.push( new ActiveThread( slug ) )
  }

  public handleChoice( c:Choice )
  {
    let result = c.callback()

    this.journal.push( new JournalEntry( result.feedback ) )

    let run_code = ( code:string ) => {
      let context = this.context
      let world = this.world
      let me = this.me
      let goto = ( cuid:string ) => me.location = world.getNodeOrSubnode( cuid )
      eval(code)
    }

    run_code( result.code )
    console.log( this.me, this.context )

    this.choices = []

    for ( let exit of this.me.location.exits )
    {
      this.choices.push( new Choice( `Go to ${exit}`, 10, () => {
        return { feedback: `I went to ${exit}`, code: `goto('${exit}')` }
      } ) )
    }

    for ( let active of this.threads )
    {
      let thread = this.findBySlug( active.slug, this.data.data.journal.threads )
      let thread_stage = thread.stages[ active.stage ]



      this.choices.push( new Choice( `Go to ${exit}`, 10, () => {
        return { feedback: `I went to ${exit}`, code: `goto('${exit}')` }
      } ) )
    }

    this.choices.push( new Choice( `test ${this.context.n}`, 20, () => {
      return { feedback: "I did test number " + this.context.n, code: "context.n++" }
    } ) )

    this.choices.sort( (a,b) => b.weight - a.weight )
  }
}

class JournalEntry { constructor( public text:string ) {} }
class Choice { constructor( public handle:string, public weight:number, public callback:()=>Result ) {} }
class Result { constructor( public feedback:string, public code:string="" ) {} }

class Me { public location=null }
class ActiveThread {
  constructor( public slug:string, public stage:number=0 ) {}
}
