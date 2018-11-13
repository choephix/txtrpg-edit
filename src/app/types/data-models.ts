
///

export interface WorldData { nodes:LocationNode[]; subnodes:LocationSubnode[]; links:Link[] }
export interface LocationNode { uid: string; slug: string; x: number; y: number }
export interface LocationSubnode extends LocationNode { parent:string }
export interface Link { from:string; to:string }

///

export interface JournalData { aliases:Alias[]; snippets:Snippet[]; actions:{goto:ActionGoTo[]} }
export interface Alias { uid: string; text: string }
export interface Snippet { key: string; text: string }
export interface ActionGoTo { from: string; to: string; params:string[]; handle:string; text:string }

///
