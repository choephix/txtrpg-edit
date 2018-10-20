import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class Logger
{
  constructor( private toastr:ToastrService ) { }

  public success( text:string, title:string )
  {
    console.log( title, text )
    this.toastr.success( text, title, {positionClass:'toast-top-right',easeTime:150,timeOut:3000} )
  }

  public info( text:string, title:string )
  {
    console.info( title, text )
    this.toastr.info( text, title, {positionClass:'toast-top-right',easeTime:150,timeOut:1500} )
  }

  public warning( text:string, title:string )
  {
    console.warn( title, text )
    this.toastr.warning( text, title, {positionClass:'toast-top-right',easeTime:150,timeOut:5000} )
  }

  public error( error:Error, title:string )
  {
    console.error( title, error )
    this.toastr.error( error.message, title, {positionClass:'toast-top-right',easeTime:150,disableTimeOut:true} )
  }
}