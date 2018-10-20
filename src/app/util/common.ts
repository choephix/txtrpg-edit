
interface CallbackResult { (data?:any):void }
interface CallbackError { (error?:Error):void }
interface CallbackDone { ():void }

/// One-time event dispatching
export class Eventu
{
  public onResult:CallbackResult[] = []
  public onError:CallbackError[] = []
  public onDone:CallbackDone[] = []
  
  private result:any = null
  private error:Error = null
  
  public subscribe( onResult:CallbackResult, 
                    onError:CallbackError=null, 
                    onDone:CallbackDone=null )
  {
    if ( onResult != null )
      this.onResult.push(onResult)
    if ( onError != null )
      this.onError.push(onError)
    if ( onDone != null )
      this.onDone.push(onDone)
      
    if ( this.error != null )
      this.dispatchError( this.error )
    else
    if ( this.result != null )
      this.dispatchResult( this.result )
  }
  
  public dispatchResult( result:any )
  {
    this.result = result
    while ( this.onResult.length > 0 )
      this.onResult.pop()( result )
    this.dispatchDone() 
  }
  
  public dispatchError( error:Error )
  { 
    this.error = error
    while ( this.onError.length > 0 )
      this.onError.pop()( error )
    this.dispatchDone() 
  }
  
  private dispatchDone()
  { 
    while ( this.onDone.length > 0 )
      this.onDone.pop()()
  }
}

export class Warning
{ 
  constructor( public message:string, public title:string=null ) { }
}