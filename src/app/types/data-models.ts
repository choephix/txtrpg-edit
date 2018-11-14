
///

export interface WorldData { nodes:LocationNode[]; subnodes:LocationSubnode[]; links:Link[] }
export interface LocationNode { uid: string; slug: string; x: number; y: number }
export interface LocationSubnode extends LocationNode { parent:string }
export interface Link { from:string; to:string }

///

export interface JournalData { aliases:Alias[]; snippets:Snippet[]; actions:{goto:LinkText[]} }
export interface Alias { uid: string; text: string }
export interface Snippet { key: string; text: string }
export interface LinkText { from: string; to: string; params:string[]; handle:string; text:string }

///
