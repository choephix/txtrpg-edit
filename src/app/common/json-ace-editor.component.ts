import { Component, Input } from '@angular/core';

@Component({
  selector: 'json-ace-editor',
  styles:[`
  ace-editor {
    transition-property: opacity, background-color;
    transition-duration: 300ms;
  }
  ace-editor.error {
    background: #311 !important;
  }
  `],
  template: `
  <ace-editor
    mode="json"
    [theme]="theme"
    [options]="options"
    [(text)]="json"
    [class.error]="error"
    [style.minHeight]="minHeight"
    ></ace-editor>`
})
export class JsonAceEditorWrapperComponent
{
  @Input() theme:string = "monokai"
  @Input() data:object = {}

	@Input() fontSize:string = `12px`
	@Input() showGutter:boolean = true
  @Input() showLineNumbers:boolean = true
  @Input() minHeight:string = "25vh"
  // @Input() minLines:number = 32

  error:Error = null

  get options():object { return {
      fontSize: this.fontSize,
      showLineNumbers: this.showLineNumbers,
      showGutter: this.showGutter,
      fixedWidthGutter: true,
      fadeFoldWidgets: true,
      showPrintMargin: false,
      wrap: true,
      tabSize: 2,
      useSoftTabs: true,
      scrollPastEnd: 0.5,
      maxLines: Infinity,
      // minLines: this.minLines,
    }
  }

  get json():string {
    return JSON.stringify(this.data,null,2)+"\n\n\n\n"
  }
  set json(value:string)
  {
    if( !value )
      return
    try
    {
      this.error = null
      Object.assign(this.data,JSON.parse(value))
    }
    catch ( error )
    {
      this.error = error
    }
  }
}
