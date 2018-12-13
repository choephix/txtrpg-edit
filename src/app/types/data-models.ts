
///

export interface WorldData { locations:LocationNode[]; subnodes:LocationSubnode[]; }
export interface LocationNode { uid: string; slug: string; x: number; y: number, exits:string[] }
export interface LocationSubnode extends LocationNode { parent:string }

///

export interface JournalData { aliases:Alias[]; snippets:Snippet[]; actions:{goto:LinkText[]} }
export interface Alias { uid: string; text: string }
export interface Snippet { key: string; text: string }
export interface LinkText { from: string; to: string; params:string[]; handle:string; text:string }

///


export class Thread {
  slug:string
  stages:ThreadStage[] = [ new ThreadStage ]
}
export class ThreadStage {
  slug:string
  interceptors:Interceptor[] = [ new Interceptor ]
}
export class Interceptor {
  when:InterceptorWhen[] = []
  what:InterceptorWhat[] = []
  choices:InterceptorChoice[] = []
  options?:InterceptorOptions
}
export class InterceptorWhen {
  condition:string
  type?:string
}
export class InterceptorWhat {
  code?:string
  text:string
  condition?:string
}
export class InterceptorChoice {
  condition?:string
  handle:string
  next:string
}
export class InterceptorOptions {
  hideDefaultChoices?:boolean = false
}
