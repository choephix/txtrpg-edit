import { Component, ViewEncapsulation } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'threads-pane',
  templateUrl: './threads-pane.component.html',
  styleUrls: ['./../flatform.scss','./threads-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadsPaneComponent
{
  get data_threads():{ [id: string] : Thread } { return this.gamedata.data.journal.threads }

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

  move( array, target, offset )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    if ( offset < -index ) offset = array.length
    array.splice(index,1)
    array.splice(index+offset,0,target)
  }

  delete( array, target )
  {
    let index = array.indexOf(target)
    if ( index < 0 ) return
    array.splice(index,1)
  }

  trackByFn(index: any, item: any) { return index; }
}

class Thread {
  slug:string
  stages:ThreadStage[]
}
class ThreadStage {
  slug:string
  interceptors:Interceptor[]
}
class Interceptor {
  when?:InterceptorWhen[] = []
  what?:InterceptorWhat[] = []
  choices?:InterceptorChoice[] = []
  options:InterceptorOptions = {}
}
class InterceptorWhen {
  condition?:string;
//   event_type?:string;
}
class InterceptorWhat {
  code?:string;
  text:string;
  condition?:string;
}
class InterceptorChoice {
  condition?:string;
  handle:string;
  next:string;
}
class InterceptorOptions {
  hideDefaultChoices?:string
}
