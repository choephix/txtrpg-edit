import { Component } from '@angular/core';
import { Game } from './game/game';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./styling/main.css']
})
export class AppComponent {
  imgurl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0ChPcUYH2D6lPGnxE-CcSI6hY0AXwg0HPQcRc1wf8cmzX0k8';

  game:Game = new Game()

  debug_log:string = ""

  constructor()
  {
    this.game.start()

//     this.debug_log = require('./data/mock-world.json')
    console.log(require('./game/mock-world.json'))
  }
}
