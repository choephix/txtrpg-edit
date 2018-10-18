import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public ALL_BRANCHES:string[] = ["master","develop","poc","lorem"]
  public branch:string = "develop"
  constructor( public router:Router )
  { 
      router.events.subscribe( e => this.branch = router.url.match(/^\/?([^\/]*)/)[1] ) 
  }
}