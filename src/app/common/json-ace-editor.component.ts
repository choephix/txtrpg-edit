import { Component, Input } from '@angular/core';

@Component({
  selector: 'json-ace-editor',
  template: `<ace-editor mode="json" [theme]="theme" [options]="options" [(text)]="json"></ace-editor>`
})
export class JsonAceEditorWrapperComponent
{
  @Input() theme:string = "tomorrow_night_eighties"
  @Input() data:object = {}

	@Input() fontSize:string = `12px`
	@Input() showGutter:boolean = false
	@Input() showLineNumbers:boolean = false

  get options():object { return {
      fontSize: this.fontSize,
      showLineNumbers: this.showLineNumbers,
      showGutter: this.showGutter,
      fixedWidthGutter: true,
      fadeFoldWidgets: true,
      showPrintMargin: false,
      wrap: true,
      scrollPastEnd: 0.5,
      maxLines: Infinity,
      minLines: 30,
      tabSize: 2,
      useSoftTabs: true
    }
  }

  get json():string { return JSON.stringify(this.data,null,2)+"\n\n\n\n" }
  set json(value:string) { if(value&&value!="null") Object.assign(this.data,JSON.parse(value)) }
}
