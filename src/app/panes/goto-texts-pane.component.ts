import { Component } from '@angular/core';
import { UID_GenerationService } from '../services/id-gen.service';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'goto-texts-pane',
  templateUrl: './goto-texts-pane.component.html',
  styleUrls: ['./../darkform.scss','./goto-texts-pane.component.scss'],
})
export class GotoActionsPaneComponent
{
  filter:Filter = new Filter
  gutter:boolean = false

  get data():LinkTextData[] { return this.gamedata.data.journal.actions.goto }
  get data_original():LinkTextData[] { return this.gamedata.originalData.journal.actions.goto }

  constructor( public gamedata:WorldDataService,
               public selection:SelectionService,
               public uidgen:UID_GenerationService )
  {
    this.selection.callbacks_OnSelect.push( o => WorldDataService.deleteEmpties( this.data ) )
  }

  passesFilter( o:LinkTextData ):boolean
  {
    if ( this.filter.from && !String(o.from).includes( this.filter.from ) ) return false
    if ( this.filter.to && !String(o.to).includes( this.filter.to ) ) return false
    if ( this.filter.search && !String(o.handle).includes( this.filter.search )
                            && !String(o.text).includes( this.filter.search ) ) return false
    return true
  }

  select( o:object )
  {
    if ( this.selection.selectedObject === o )
      return;
    this.selection.selectObject(o)
  }

  isDirty( o:LinkTextData, key:string ):boolean
  {
    if ( !o["uid"] ) throw new TypeError(`${o} has no property 'uid'`)
    let original = this.find( o["uid"], this.data_original )
    return (original!=null) && !(original[key] === o[key])
  }

  isDirtyIndex( o:LinkTextData ):boolean
  {
    if ( !o["uid"] ) throw new TypeError(`${o} has no property 'uid'`)
    let original = this.find( o["uid"], this.data_original )
    return (original!=null) && !(this.data.indexOf(o) === this.data_original.indexOf(original))
  }

  isDirtyNew( o:LinkTextData ):boolean
  {
    if ( !o["uid"] ) throw new TypeError(`${o} has no property 'uid'`)
    return this.find( o["uid"], this.data_original ) == null
  }

  find( uid:string, $in:LinkTextData[] ):LinkTextData
  {
    for ( const o of $in )
      if ( o.hasOwnProperty("uid") )
        if ( o["uid"] === uid )
          return o
    return null
  }

  delete( index:number )
  {
    this.data.splice(index,1)
  }

  move( item:LinkTextData, index:number, offset:number )
  {
    this.data.splice(index,1)
    this.data.splice(index+offset,0,item)
  }

  add( index:number )
  {
    let item:LinkTextData = {uid:this.uidgen.make(8)}
    if ( this.filter.from ) item.from = this.filter.from
    if ( this.filter.to ) item.to = this.filter.to
    if ( this.filter.search ) this.filter.search = ""
    this.data.splice(index,0,item)
    this.data_original.splice(index,0,{uid:null})
  }

  cloneTo( source:LinkTextData, index:number )
  {
    let item:LinkTextData = {uid:null}
    Object.assign(item,source)
    item["uid"] = this.uidgen.make(8)
    this.data.splice(index,0,item)
    this.data_original.splice(index,0,{uid:null})
  }
}

class Filter
{
  constructor( public from:string='', public to:string='', public search:string='' ) {}
}

interface LinkTextData
{ uid:string, from?: string, to?: string, params?:string[], handle?:string, text?:string }

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
