

export interface WorldData
{ nodes:Node[], subnodes:Subnode[], links:Link[] }

export interface Node { id: string, loc_x: number, loc_y: number }

export interface Subnode extends Node { parent:string }

export interface Link { from:string, to:string }

