import { Component, ViewEncapsulation } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'threads-pane',
  templateUrl: './threads-pane.component.html',
  styleUrls: ['./../darkform.scss','./threads-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadsPaneComponent
{
  get data_threads():{ [id: string] : Thread } { return this.gamedata.data.journal.threads }

  factory_thread = ():Thread => ({
    slug:"thread_"+this.uidgen.make(5),
    stages:[ { slug:"initial", interceptors:[ this.factory_interceptor() ] } ]
  })
  factory_stage = ():ThreadStage => ({
    slug:"stage_"+this.uidgen.make(2),
    interceptors:[ this.factory_interceptor() ]
  })
  factory_interceptor = ():Interceptor => ({
    when: [this.factory_interceptor_when()],
    what: [this.factory_interceptor_what()],
    choices: [this.factory_interceptor_choice()]
  })
  factory_interceptor_when = ():InterceptorWhen => ({ type:"goto", condition:"true" })
  factory_interceptor_what = ():InterceptorWhat => ({ text:" ✶ ✶ ✶ " })
  factory_interceptor_choice = ():InterceptorChoice => ({ handle:"...", next:this.makeNewChoiceNextCUID() })

  currentThread:Thread = null
  currentInterceptorText:string = null
  currentInterceptorChoice:InterceptorChoice = null

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data_threads ) )
  }

  selectChoice( choice, interceptor ):void
  {
    this.currentInterceptorText = interceptor ? interceptor.what[0].text : null
    this.currentInterceptorChoice = choice
  }

  selectThread( thread ):void
  {
    this.currentThread = thread
    this.currentInterceptorText = null
    this.currentInterceptorChoice = null
  }

  openContextMenu(event) {
    event.preventDefault(); // Suppress the browser's context menu
    // this.contextMenu.openMenu(); // Open your custom context menu instead
    alert(4345)
  }

  makeNewChoiceNextCUID()
  { return `${this.uidgen.make(12)}` }

  trackByFn(index: any, item: any) { return index; }
}

class Thread {
  slug:string
  stages:ThreadStage[] = [ new ThreadStage ]
}
class ThreadStage {
  slug:string
  interceptors:Interceptor[] = [ new Interceptor ]
}
class Interceptor {
  when:InterceptorWhen[] = []
  what:InterceptorWhat[] = []
  choices:InterceptorChoice[] = []
  options?:InterceptorOptions
}
class InterceptorWhen {
  condition:string
  type?:string
}
class InterceptorWhat {
  code?:string
  text:string
  condition?:string
}
class InterceptorChoice {
  condition?:string
  handle:string
  next:string
}
class InterceptorOptions {
  hideDefaultChoices?:boolean = false
}
