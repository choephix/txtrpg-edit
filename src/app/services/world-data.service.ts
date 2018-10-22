import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { DataLoader } from './../util/data-loader'
import { Eventu, Warning } from './../util/common'
import { Logger } from './logging.service'

const ACCO:string = "choephix"
const REPO:string = "txtrpg-data"
const FILE:string = "mock-world"

@Injectable({providedIn: 'root'})
export class WorldDataService
{
  private loader:DataLoader

  constructor( private http:HttpClient, private logger:Logger )
  { this.loader = new DataLoader( this.http ) }

  public get data():any { return this.loader.data }
  public get hasData():boolean { return this.loader.data != null }

  public load( branch:string ):Eventu
  {
    this.loader.data = null

    let eve: Eventu = new Eventu()
    let method:"raw"|"api" = "raw"
    this.loader.setBranch( branch )
    this.loader.load( method ).subscribe(
      data => {
        this.logger.info(`${this.loader.filename}, via Github ${method}`,`LOADED ${this.loader.BRANCH}`)
        eve.dispatchResult( data )
      },
      error => {
        if ( error instanceof Warning)
      	  this.logger.warning( error.message, error.title )
      	else
      	  this.logger.error( error, `LOAD FAILED` )
      	eve.dispatchError( error )
      }
    )
    return eve
  }

  public save():Eventu
  {
    let eve:Eventu = new Eventu()
    this.loader.save().subscribe(
      data => {
        this.logger.success(`${this.loader.filename}, via Github API`,`SAVED ${this.loader.BRANCH}`)
        eve.dispatchResult( data )
      },
      error => {
        if ( error instanceof Warning )
      	  this.logger.warning( error.message, error.title )
      	else
      	  this.logger.error( error, `SAVE FAILED` )
      	eve.dispatchError( error )
      }
    )
    return eve
  }

  public applyData( data:any )
  {
    if( typeof data === 'string' )
      Object.assign( this.loader.data, JSON.parse(data) )
    else
      Object.assign( this.loader.data, data )
  }

  public getJson()
  {
    return this.hasData ? JSON.stringify( this.loader.data, null, 2 ) : "{}"
  }
}
