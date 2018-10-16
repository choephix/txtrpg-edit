import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gitbub } from './../util/gitbub';
import { GitbubAutomodiGo } from './../util/gitbub-automodi';

const FILE:string = "mock-world"
const BRANCH:string = "develop"

@Injectable({providedIn: 'root'})
export class GlobalWorldDataService
{
	public bub:Gitbub
	public loaded:boolean = false

  constructor( private http:HttpClient )
  {
		this.bub = new Gitbub(FILE,BRANCH,http)
		this.bub.load( (data) => this.onWorldFileLoaded(data) )

		GitbubAutomodiGo.go(http)
  }

  public save()
  {
  	this.bub.save(()=>console.log("\n::DATA::SAVED::\n\n"))
  }

  private onWorldFileLoaded( data )
  {
  	this.loaded = true
  	console.log("Loaded\n",data)
  }
}
