import { Component, ViewEncapsulation } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'game-client-pane',
  styles: [`
    .mamain {
      display:flex;
      flex-flow:column;
      width:100%;
      height:100%;
      text-align:center;
      font-size: 2vh;
    }

    ::-webkit-scrollbar-corner { background: none; }
    ::-webkit-scrollbar-track { background: none; }
    ::-webkit-scrollbar
    {
      width: 8px;
      height: 8px;
      background: none;
    }
    ::-webkit-scrollbar-thumb
    {
      background-color: #0000;
      border: 1px solid #0000;
      cursor: pointer;
    }
    :hover::-webkit-scrollbar-thumb { background-color: #555; border-color: #222; }

    .choice { transition: color 150ms; cursor: pointer; }
    .choice:hover { color:white; }
  `],
  template: `
    <div class="mamain">
      <div style="display:flex; flex-flow:column-reverse; flex: 1 1; overflow-y:overlay;">
        <div class="entry" *ngFor="let entry of game.journal.reverse()">
          {{entry.text}}
        </div>
      </div>
      <div style="display:flex; flex: 0 0 100px; align-items: center;">
        <div style="width:100%;">~</div>
      </div>
      <div style="display:flex; flex-flow:column; flex: 1 1;">
        <a class="choice" *ngFor="let choice of game.choices" (click)="game.handleChoice(choice)">
          {{choice.handle}}
        </a>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class GameClientPaneComponent
{
  constructor( public game:GameService )
  {
  }
}
