import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gitbub } from './../util/gitbub';
import { GitbubAutomodiGo } from './../util/gitbub-automodi';
import { ToastrService } from 'ngx-toastr';

const FILE:string = "mock-world"
const BRANCH:string = "develop"

@Injectable({providedIn: 'root'})
export class WorldDataService
{
	public bub:Gitbub
	public loaded:boolean = false

  private sub: any;

  constructor( private http:HttpClient, private toastr:ToastrService )
  {
    this.bub = new Gitbub( this.http, this.toastr )
  }

  public load( branch:string )
  { this.bub.load( FILE, branch, (data) => this.onWorldFileLoaded(data) ) }

  public save()
  { this.bub.save(()=>this.toastr.success(`Saved to ${BRANCH}`)) }

  private onWorldFileLoaded( data )
  {
  	console.log("world data:\n",data)
  	this.loaded = true
    this.toastr.success("Loaded")
  	GitbubAutomodiGo.go(this.http)
  }
}
