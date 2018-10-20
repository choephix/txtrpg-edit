import { NgModule } from '@angular/core'
import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorldDataService } from './services/world-data.service';
import { SelectionService } from './services/selection.service';
import { AutomodiPanelComponent } from './view/other.component'

declare var angular: any;
declare var JSONEditor: any;

@NgModule({ declarations: [ AutomodiPanelComponent ] })
@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent
{
  public branches:string[] = ["shitbox","develop","lorem","poc","master"]
	public pages:string[] = []
	public sidetabs:string[] = ["json","automodi","else","elser"]
  
  public branch:string = "develop"
  public page:string = null
  public sidetab:string = this.sidetabs[0]

  constructor( public router:Router, 
               private route:ActivatedRoute, 
               public world:WorldDataService, 
               public selection:SelectionService )
  {
    this.route.paramMap.subscribe( params => {
    	this.branch = params.get("branch")
    	if ( !this.branch ) console.warn("no branch?",params)
    	else world.load(this.branch)
    } );

		for ( const r of router.config )
			if ( r.path === ":branch" )
				for ( const pg of r.children )
					if ( pg.path )
						this.pages.push( pg.path )
  }
  
  private jsoneditor
  private jsoneditor_options = {
    mode:'form',
    modes:['tree','view','form','code','text'],
    navigationBar:false,
    statusBar:false,
    search:false,
    onChange:()=>this.onJsonDataChange()
  };
  @ViewChild('jsoneditor') jsoneditor_ref:ElementRef;
  ngAfterViewInit() {
    this.jsoneditor = new JSONEditor(
                          this.jsoneditor_ref.nativeElement, 
                          this.jsoneditor_options,
                          {} );
    this.selection.callbacks_OnSelect.push( o => this.jsoneditor.set(o) )
  }
  
  onJsonDataChange()
  {
    this.selection.dispatchObjectModified( this.jsoneditor.get() )
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(e:KeyboardEvent) {
  	if ( e.keyCode == 19 && e.ctrlKey && e.shiftKey )
    	this.world.save()
    else
    	return
    e.preventDefault();
    e.stopPropagation();
  }

  log(o) { console.log(o) }
}