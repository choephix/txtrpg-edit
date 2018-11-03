import { SelectionService } from './../services/selection.service';
import { ChangeDetectionStrategy, Component, ViewChildren } from '@angular/core';
import { WorldDataService } from './../services/world-data.service';

// @Directive({selector: 'textareafix'})
// class ChildDirective {}

@Component({
  templateUrl: './words-view.component.html',
  styleUrls: ['./words-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorViewChild_Words 
{
  filter = {
    from:"",
    to:"",
    search:""
  }

  constructor( public gamedata:WorldDataService, public selection:SelectionService ) { }

  passesFilter( o ):boolean
  {
    if ( this.filter.from && !String(o.from).includes( this.filter.from ) ) return false
    if ( this.filter.to && !String(o.to).includes( this.filter.to ) ) return false
    if ( this.filter.search && !String(o.handle).includes( this.filter.search )
                            && !String(o.text).includes( this.filter.search ) ) return false
    return true
  }

  move( item, index, offset )
  {
    this.gamedata.data.journal.actions.goto.splice(index,1)
    this.gamedata.data.journal.actions.goto.splice(index+offset,0,item)
  }

  cloneTo( source, index )
  {
    console.log(source)
    let item = {}
    Object.assign(item,source)
    this.gamedata.data.journal.actions.goto.splice(index,0,item)
  }

  fixTextarea(el)
  {
    el.style.height = el.scrollHeight + "px"
  }
}


// for ( let link of this.world.links )
// {
//     http.get("https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=json")
//     .subscribe( data => {
//         data = data[0].replace("  ","\n")
//         data += "\nI had returned to "+link.to.replace("@","")
//         console.log( data )
//         this.journal.actions.goto.push({
//             from: link.from,
//             to: link.to,
//             params:"back",
//             handle: "Go back to "+link.to.replace("@",""),
//             text: data
//         })
//     } )
// }
