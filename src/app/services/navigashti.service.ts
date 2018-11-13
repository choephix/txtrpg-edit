import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { WorldDataService } from '../services/world-data.service';

@Injectable({providedIn: 'root'})
export class NavigashtiService
{
  public branches:string[] = ["shitbox","develop","lorem","poc","master"]
	public pages:string[] = []

  public currentBranch:string = "develop"
  public currentPage:string = null

  constructor( public router:Router, public route:ActivatedRoute, public world:WorldDataService )
  {
		for ( const r of router.config )
			if ( r.path === ":branch" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )

    this.route.paramMap.subscribe( params => {
      console.log( "NAVIGASHTI ",params,params.get("branch") )
    	let branch = params.get("branch")
    	if ( !branch )
    	  console.warn("no branch?",params)
    	else
    	  this.currentBranch = branch
      world.load(this.currentBranch)
    } );

    this.router.events.subscribe(event => {
      if ( event instanceof NavigationEnd )
      {
        route.firstChild.firstChild.url.subscribe( v => this.currentPage=v.toString() )
        // console.log( "NAVIGASHTI ", event, router, route )
      }
    });
  }

  public getUrl( branch:string=null, page:string=null )
  {
    let url = this.router.url;
    if ( branch != null ) url = url.replace(this.currentBranch,branch)
    if ( page != null ) url = url.replace(this.currentPage,page)
    return url
  }
}
