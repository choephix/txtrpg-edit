import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
	public branch:string = "develop"
  constructor( public router:Router )
  { router.events.subscribe( e => this.branch = router.url.match(/^\/?([^\/]*)\//)[1] ) }
}

@Component({
	styles: [`
	body,div,p { overflow:hidden; }
	#fof {
		font-size:56vw;
		font-family:"Arial Black";
		text-align:center;
    margin-left: -100%;
    margin-right: -100%;
		opacity:.1;
    transform: rotate(15deg);
	}`],
  template: `<div id='fof'>404</div>`,
})
export class Page404Component {
  constructor() {}
}
