import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Eventu, Warning } from './../util/common'

const ACCO:string = "choephix"
const REPO:string = "txtrpg-data"
const FILE:string = "mock-world"

export class DataLoader
{
  public filename:string
  public branch:string
  public BRANCH:string
  
  public busy:boolean = false
	
  public sha:string
  public data:any
  public dataOriginalJson:string

  public headers_save:HttpHeaders = 
         new HttpHeaders({ 'Authorization':"token "+"5535751a"+"806280e0e6d50e52"+"d0b9d53b732dea8e" })
  public headers_load:HttpHeaders = 
         new HttpHeaders({ 'If-Modified-Since':'Mon, 26 Jul 1997 05:00:00 GMT',
                           'Content-Type':'application/json',
                           })
  
  constructor( private http:HttpClient ) {}
  
  public setBranch( branch:string ):void
  {
  	this.filename = FILE;
  	this.branch = branch;
  	this.BRANCH = branch.toUpperCase();
  }
  
  /// @param raw : if true, a raw link to the file's contents will be used, 
  /// instead of the Guthub API, which is faster and does not count to the
  /// 60 requests per hour max limit the API has otherwise. However, this 
  /// method does not retrieve a SHA, which means saving for the first time
  /// will make two requests.
  public load( raw:boolean ):Eventu
  {
    let eve:Eventu = new Eventu()
    
    try
    {
      if ( this.busy ) throw new Error(`Loader is busy`)
    	if ( !this.filename ) throw new Error(`Loader.filename is ${this.filename}`)
    	if ( !this.branch ) throw new Error(`Loader.branch is ${this.branch}`)
      
      this.busy = true
      if ( raw )
      {
    		let bust:string = this.generateCacheBust()
        let url:string = `https://raw.githubusercontent.com/${ACCO}/${REPO}/`+
                         `${this.branch}/${this.filename}?${bust}`
        this.http.get( url ).subscribe( 
          data => {
      	    this.busy = false
      	    this.data = data
          	eve.dispatchResult( data )
          },
          error => eve.dispatchError( error )
        );
      }
      else
      {
    		let bust:string = this.generateCacheBust()
        let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/`+
        								 `contents/${this.filename}?ref=${this.branch}&${bust}`
        this.http.get( url, { headers : this.headers_load } ).subscribe( 
          data => {
      	    this.busy = false
      	    this.sha = data['sha']
      	    this.dataOriginalJson = B64UTF8.Decode(data['content'])
      	    this.data = JSON.parse(this.dataOriginalJson)
      	    this.dataOriginalJson = this.generateJson()
          	eve.dispatchResult( this.data )
          },
          error => eve.dispatchError( error )
        )
      }
    }
    catch ( error )
    {
      eve.dispatchError( error )
    }
    
    return eve
  }
  
  /// 
  public save():Eventu
  {
    let eve:Eventu = new Eventu()
    
    try
    {
      if ( this.busy ) throw new Error(`Loader is busy`)
    	if ( !this.filename ) throw new Error(`Loader.filename is ${this.filename}`)
    	if ( !this.branch ) throw new Error(`Loader.branch is ${this.branch}`)
    	if ( !this.data ) throw new Error(`Loader.data is ${this.data}`)
    	
    	const json = this.generateJson();
      if ( json == this.dataOriginalJson )
        throw new Warning( this.filename + " was not saved", "Nothin' changed!" );
        
    	let actuallySave = () =>
    	{
        let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/contents/${this.filename}`
        let commit_message:string = `update ${this.filename} via online editor`
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
          	  eve.dispatchResult( data )
            },
            error => eve.dispatchError( error )
          );
    	}
      
    	if ( this.sha )
    	{
    	  actuallySave()
    	}
    	/// Load that SHA first, then actuallySave()
    	else
    	{
    	  console.warn( "Loading for the SHA", "No SHA" )
    	  
  		  let bust:string = this.generateCacheBust()
        let url:string = `https://api.github.com/repos/${ACCO}/${REPO}/`+
        								 `contents/${this.filename}?ref=${this.branch}&${bust}`
        this.busy = true;
        this.http.get( url ).subscribe(
          data => {
      	    console.log( "loaded ",data );
      	    this.busy = false;
      	    this.sha = data['sha'];
      	    if ( this.sha )
      	      actuallySave()
            else
              throw new Error("Can't get that sha, dawg...")
          },
          error => {
            throw new Error(`Can't load SHA\n${error.message}`)
          }
        )
    	}
    }
    catch ( error )
    {
      eve.dispatchError( error )
    }
    
    return eve
  }

  public hasDataChanged():boolean { return this.dataOriginalJson != this.generateJson() }

  private generateJson():string { return JSON.stringify( this.data, null, 2 ) }

  private generateCacheBust():string { return "" + new Date().valueOf() % 1000000 }
}

class B64UTF8 {
  public static Encode( str:string): string {
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
  public static Decode( str:string ): string {
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