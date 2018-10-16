import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Gitbub } from './../util/gitbub';
import { GitbubAutomodiGo } from './../util/gitbub-automodi';

const FILE:string = "mock-world"
const BRANCH:string = "develop"

@Injectable({providedIn: 'root'})
export class GlobalWorldDataService
{
	public bub:Gitbub
	public loaded:boolean = false

  private sub: any;

  constructor( private http:HttpClient ) {}

  public load(branch:string)
  {
		this.bub = new Gitbub(FILE,branch,this.http)
		this.bub.load( (data) => this.onWorldFileLoaded(data) )
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
