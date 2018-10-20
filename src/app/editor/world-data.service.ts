import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Logger } from './logging.service';

const ACCO:string = "choephix"
const REPO:string = "txtrpg-data"
const FILE:string = "mock-world"

@Injectable({providedIn: 'root'})
export class WorldDataService
{
  public filename:string
  public branch:string
  public BRANCH:string
  
  public busy:boolean = false
	public loaded:boolean = false
	
  public sha:string
  public data:any
  public dataOriginalJson:string

  public headers_save:HttpHeaders = 
         new HttpHeaders({ 'Authorization':"token "+"5535751a"+"806280e0e6d50e52"+"d0b9d53b732dea8e" })
  public headers_load:HttpHeaders = 
         new HttpHeaders({ 'If-Modified-Since':'Mon, 26 Jul 1997 05:00:00 GMT',
                           'Pragma':'no-cache',
                           'Cache-Control':'no-cache',
                           'Content-Type':'application/json',
                           })
  
  constructor( private http:HttpClient, private toast:Logger ) {}

  public load( branch:string ):void
  {
  	this.filename = FILE;
  	this.branch = branch;
  	this.BRANCH = branch.toUpperCase();
  	this.loadWithoutAPI()
  }

  public loadWithAPI():void
  {
		let bust:string = this.generateCacheBust()
    let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/`+
    								 `contents/${this.filename}?ref=${this.branch}&${bust}`
    this.busy = true
    this.http.get( url, { headers : this.headers_load } ).subscribe( 
      data => {
  	    this.busy = false
  	    this.sha = data['sha']
  	    this.dataOriginalJson = B64UTF8.Decode(data['content'])
  	    this.data = JSON.parse(this.dataOriginalJson)
  	    this.loaded = true
      	this.toast.info(`${this.filename}, via Github API`,`LOADED ${this.BRANCH}`)
      },
      error => {
  	    this.toast.error(error,"LOAD FAILED")
      },
    );
  }

  public loadWithoutAPI():void
  {
		let bust:string = this.generateCacheBust()
    let url:string = `https://raw.githubusercontent.com/${ACCO}/${REPO}/`+
                     `${this.branch}/${this.filename}?${bust}`
    this.busy = true
    this.http.get( url ).subscribe( 
      data => {
  	    this.busy = false
  	    this.data = data
  	    this.loaded = true
      	this.toast.info(`${this.filename}, raw`,`LOADED ${this.BRANCH}`)
      },
      error => {
  	    this.toast.error(error,"LOAD FAILED")
      },
    );
  }

  public save():void
  {
    if ( this.busy )      { console.error(`filename is ${this.filename}`); return; }
  	if ( !this.filename ) { console.error(`filename is ${this.filename}`); return; }
  	if ( !this.data )     { console.error(`data is ${this.data}`); return; }
    
  	if ( !this.sha )
  	{
  	  this.toast.info("Loading for the SHA","No SHA")
  	  
		  let bust:string = this.generateCacheBust()
      let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/`+
      								 `contents/${this.filename}?ref=${this.branch}&${bust}`
      this.busy = true;
      this.http.get( url ).subscribe(
        data => {
    	    console.log( "loaded ",data );
    	    this.busy = false;
    	    this.sha = data['sha'];
    	    if ( this.sha ) this.save()
          else throw new Error("Can't get that sha, dawg...")
        },
        error => {
    	    this.toast.error(error,"SAVE FAILED")
        },
      );
      return;
  	}
  	
  	const json = this.generateJson();
    if ( json == this.dataOriginalJson )
    { 
      this.toast.warning( this.filename + " was not saved", "Nothin' changed!" ); 
      return;
    }

		let file:string = this.filename
    let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${file}`
    let commit_message:string = `update ${file} via online editor`
		let author:string = "txt-rpg-online-editor"
		let email:string = "dev@thechoephix.com"

    let body = {
    	sha : this.sha,
    	message : commit_message,
    	content : B64UTF8.Encode(json),
    	branch: this.branch,
    	committer: {name:author,email:email},
    };

    this.http.put( url, body, { headers : this.headers_save } )
      .subscribe( 
        data => {
          console.log( "saved data", data );
          this.sha = data['content']['sha'];
          this.dataOriginalJson = json;
          this.toast.success(this.filename,`SAVED ${this.BRANCH}`)
        },
        error => {
    	    this.toast.error(error,"SAVE FAILED")
        }
      );
  }

  public hasDataChanged():boolean { return this.dataOriginalJson != this.generateJson() }

  private generateJson():string { return JSON.stringify( this.data, null, 2 ) }

  private generateCacheBust():string { return "" + new Date().valueOf() % 1000000 }
}

class B64UTF8 {
  public static Encode(str: string): string {
    if (window
        && "btoa" in window
        && "encodeURIComponent" in window) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(("0x" + p1) as any);
        }));
    } else {
        console.warn("b64EncodeUnicode requirements: window.btoa and window.encodeURIComponent functions");
        return null;
    }

  }
  public static Decode(str: string): string {
    if (window
        && "atob" in window
        && "decodeURIComponent" in window) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
    } else {
        console.warn("b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions");
        return null;
    }
  }
}