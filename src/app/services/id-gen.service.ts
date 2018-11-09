import { Injectable } from '@angular/core';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_&"

@Injectable({providedIn: 'root'})
export class UID_GenerationService
{
  public make( length:number = 6 )
  {
    let hashy = ""
    let a_len = ALPHABET.length
    for ( let i = 0; i < length; i++ )
      hashy += ALPHABET.charAt( Math.floor( a_len * Math.random() ) )
    return hashy
  }
}
