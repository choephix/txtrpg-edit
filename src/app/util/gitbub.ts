import { HttpClient, HttpHeaders } from '@angular/common/http';

const ACCO:string = "choephix"
const REPO:string = "txtrpg-data"

export class Gitbub
{
  public busy:boolean;
  public sha:string;
  public data;
  public dataOriginalJson:string;

  constructor( public filename:string, public branch:string, private http:HttpClient ) { }

  public load( callbackLoaded : (data) => void ):void
  {
    console.log( "loading " + this.filename )

		let file:string = this.filename
		let bust:string = this.generateCacheBust()
    let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${file}?ref=${this.branch}&${bust}`

    this.busy = true;
    this.http.get( url ).subscribe( data => {
	    console.log( "loaded "+this.filename, data );
	    this.busy = false;
	    this.sha = data['sha'];
	    this.dataOriginalJson = B64UTF8.Decode(data['content']);
	    this.data = JSON.parse(this.dataOriginalJson);
      callbackLoaded( this.data );
    } );
  }

  public save( callbackSaved : () => void ):void
  {
  	const json = this.generateJson();

    if ( json === this.dataOriginalJson )
    {
      console.warn( this.filename + " - nothng changed to save" );
      return;
    }

		let file:string = this.filename
    let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${file}`
    let commit_message:string = `update ${file} from online editor`
		let author:string = "txt-rpg-online-editor"
    let token:string = "";
    token += "89077a77414ceba566cc2acfdf11f67d91720abe";

    let headers = new HttpHeaders().set( "Authorization", "token  " + token );
    let body = {
    	sha : this.sha,
    	message : commit_message,
    	content : B64UTF8.Encode(json),
    	branch: this.branch,
    	committer: {name:author,email:"dev@thechoephix.com"},
    };

    this.http.put( url, body, { headers : headers } )
      .subscribe( data => {
		    console.log( data );
		    this.sha = data['content']['sha'];
    		this.dataOriginalJson = json;
        callbackSaved();
       } );
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