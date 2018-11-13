import { Component } from '@angular/core';

@Component({
  selector:"two-pane-view",
  styleUrls:["../variables.scss","../darkform.scss"],
  template:`
  <style type="scss/text">
  #full-page {
    display: flex;
    flex-direction: row;
    height:100vh;
    overflow:hidden;
  }
  .pane {
    overflow-x: visible;
    overflow-y: scroll;
    min-height: 100%;
  }
  </style>

  <div id="full-page" class="darkform">
    <div class="pane" style="width: 61.8%;">
      <ng-content select="[pane-left]"></ng-content>
    </div>
    <div class="pane" style="width: 38.2%;">
      <ng-content select="[pane-right]"></ng-content>
    </div>
  </div>`
})
export class TwoPaneViewComponent {}
