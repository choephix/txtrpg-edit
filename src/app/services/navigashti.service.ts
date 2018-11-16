import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { WorldDataService } from '../services/world-data.service';

@Injectable({providedIn: 'root'})
export class NavigashtiService
{
  public branches:string[] = ["poc","master"]
	public pages:string[] = []

  public currentBranch:string = null
  public currentPage:string = null

  constructor( public router:Router, public route:ActivatedRoute, public world:WorldDataService, http:HttpClient )
  {
		for ( const r of router.config )
			if ( r.path === ":branch" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )

    this.router.events.subscribe( event => this.onRouterEvent(event) );
    
    http.get("https://api.github.com/repos/choephix/txtrpg-data/branches")
        .subscribe(o=>this.branches=o.map(o=>o.name))
  }

  private onRouterEvent( event )
  {
    if ( event instanceof NavigationEnd )
    {
      this.route.firstChild.firstChild.url.subscribe( v => this.currentPage=v.toString() )
      this.route.firstChild.url.subscribe( v => this.setBranch( v.toString() ) )
    }
  }

  private setBranch( branch:string )
  {
    if ( branch != this.currentBranch )
    {
      this.currentBranch = branch;
      this.world.load( this.currentBranch )
    }
  }

  public getUrl( branch:string=null, page:string=null )
  {
    let url = this.router.url;
    if ( branch != null ) url = url.replace( this.currentBranch, branch )
    if ( page != null ) url = url.replace( this.currentPage, page )
    return url
  }
}
