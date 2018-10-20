import { Component } from '@angular/core';

@Component({
	styles: [`
  ::-webkit-scrollbar {display:none !important;}
	body,div,p { overflow:hidden; }
	#wrap {
    width:100wh;
    overflow:hidden;
	}
	#fof {
		font-size:56vw;
		font-family:"Arial Black";
		text-align:center;
    margin-left: -100%;
    margin-right: -100%;
		opacity:.1;
    transform: rotate(15deg);
	}`],
  template: `<div id="wrap"><div id='fof'>404</div></div>`,
})
export class Page404Component {
  constructor() {}
}