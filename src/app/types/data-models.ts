
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
