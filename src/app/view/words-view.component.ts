import { Component } from '@angular/core';

@Component({
  template: `
  <div id="full-page" class="darkform">
    <div class="pane" style="width: 61.8%;">
      <goto-actions-pane>
      </goto-actions-pane>
    </div>
    <!-- SPLIT -->
    <div class="pane" style="width: 38.2%;">
      <journal-helper-pane>
      </journal-helper-pane>
    </div>
  </div>`,
  styles: [
  require("../variables.scss"),
  require("../darkform.scss"), `
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
  }`],
})
export class EditorViewChild_Words {}
