import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionService } from '../services/selection.service';
import { WorldDataService } from '../services/world-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent
{
  public branches:string[] = ["shitbox","develop","lorem","poc","master"]
	public pages:string[] = []
	public sidetabs:string[] = ["json","automodi","null"]

  public branch:string = "develop"
  public page:string = null
  public sidetab:string = this.sidetabs[0]

  constructor( public router:Router,
               public route:ActivatedRoute,
               public world:WorldDataService,
               public selection:SelectionService )
  {
    this.route.paramMap.subscribe( params => {
    	let branch = params.get("branch")
    	if ( !branch )
    	  console.warn("no branch?",params)
    	else
    	  this.branch = branch
        world.load(this.branch)

      for (const pg of this.pages)
        if ( this.router.url.includes( pg ) )
          this.page = pg
    } );

		for ( const r of router.config )
			if ( r.path === ":branch" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )
  }
}
