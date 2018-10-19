import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

const ACCO:string = "choephix"
const REPO:string = "txtrpg-data"

export class Gitbub
{
  public busy:boolean
  public sha:string
  public data
  public dataOriginalJson:string

  public filename:string
  public branch:string
  
  constructor( private http:HttpClient, private toastr:ToastrService ) { }

  public load( filename:string, branch:string, callbackLoaded : (data) => void ):void
  {
  	this.filename = filename;
  	this.branch = branch;
  	this.loadWithoutAPI( callbackLoaded )
  }

  public loadWithAPI( callbackLoaded : (data) => void ):void
  {
    console.log( `loading ${this.filename} from branch ${this.branch.toUpperCase()}`)

		let bust:string = this.generateCacheBust()
    let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/`+
    								 `contents/${this.filename}?ref=${this.branch}&${bust}`

    this.busy = true;
    this.http.get( url ).subscribe( data => {
	    console.log( "loaded " + this.filename );
	    this.busy = false;
	    this.sha = data['sha'];
	    this.dataOriginalJson = B64UTF8.Decode(data['content']);
	    this.data = JSON.parse(this.dataOriginalJson);
      callbackLoaded( this.data );
    } );
  }

  public loadWithoutAPI( callbackLoaded : (data) => void ):void
  {
    console.groupCollapsed( `loading ${this.filename} from /${this.branch.toUpperCase()}` )
    console.warn( `not using Github API, but "raw" link instead)`)
    
		let bust:string = "" + new Date().valueOf() % 1000000
    let url:string = `https://raw.githubusercontent.com/${ACCO}/${REPO}/${this.branch}/${this.filename}?${bust}`
  //   let url:string = `https://raw.githubusercontent.com/${ACCO}/${REPO}/${branch}/${this.filename}`
  // 	let headers = {
  //     'If-Modified-Since':'Mon, 26 Jul 1997 05:00:00 GMT',
  //     'Cache-Control':'no-cache',
  //     'Pragma':'no-cache',
  // 	}
    
    this.busy = true
    this.http.get( url ).subscribe( data => {
	    this.busy = false
	    this.data = data;
	    console.log( `loaded ${this.filename}`, this.data );
      callbackLoaded( this.data );
      console.groupEnd()
    } );
  }

  public save( callbackSaved : () => void ):void
  {
  	if ( !this.filename ) { console.error(`filename is ${this.filename}`); return; }
  	if ( !this.data )     { console.error(`data is ${this.data}`); return; }
    
  	if ( !this.sha )
  	{
  	  console.warn( "no sha, loading for sha" );
		  let bust:string = this.generateCacheBust()
      let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${this.filename}?ref=${this.branch}&${bust}`
      this.busy = true;
      this.http.get( url ).subscribe( data => {
  	    console.log( "loaded ",data );
  	    this.busy = false;
  	    this.sha = data['sha'];
        this.save( callbackSaved ) // recurse this shit
      } );
  	}
    else
    {
    	const json = this.generateJson();
  
      if ( json === this.dataOriginalJson )
      { console.warn( this.filename + " - nothng changed to save" ); return; }
  
  		let file:string = this.filename
      let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${file}`
      let commit_message:string = `update ${file} via online editor`
  		let author:string = "txt-rpg-online-editor"
  		let email:string = "dev@thechoephix.com"
      let token:string = "5535751a" + "806280e0" + "e6d50e52" + "d0b9d53b" + "732dea8e";
  
      let headers = new HttpHeaders().set( "Authorization", "token  " + token );
      let body = {
      	sha : this.sha,
      	message : commit_message,
      	content : B64UTF8.Encode(json),
      	branch: this.branch,
      	committer: {name:author,email:email},
      };
  
      this.http.put( url, body, { headers : headers } )
        .subscribe( data => {
  		    console.log( "saved data", data );
  		    this.sha = data['content']['sha'];
      		this.dataOriginalJson = json;
          callbackSaved();
         } );
    }
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