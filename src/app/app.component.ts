import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Game } from './game/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./styling/main.css']
})
export class AppComponent {

  @ViewChild('separator') _separator:ElementRef
  
  imgurl = 'https://mbtskoudsalg.com/images/filigree-divider-png.png';

  game:Game = new Game()

  debby:string = " wha- "
  
  constructor()
  {
    this.game.start()
    this.game.onChange = this.scroll
  }

  ngAfterViewInit()
  {
    this.scroll()
  }

  protected scroll() {
    console.log("scrolling")
    const o = this._separator.nativeElement;
    scrollBy( 0, o.y - innerHeight * .5 + o.height * .5 )
  }
}
