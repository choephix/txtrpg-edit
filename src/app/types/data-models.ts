
///

export interface WorldData { nodes:Node[], subnodes:Subnode[], links:Link[] }
export interface Node { uid: string, slug: string, x: number, y: number }
export interface Subnode extends Node { parent:string }
export interface Link { from:string, to:string }

///

export interface JournalData { aliases:Alias[], snippets:Snippet[], actions:{goto:ActionGoTo[]} }
export interface Alias { uid: string, text: string }
export interface Snippet { key: string, text: string }
export interface ActionGoTo { from: string, to: string, params:string[], handle:string, text:string }

///
