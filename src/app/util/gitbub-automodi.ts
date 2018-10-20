import { HttpClient } from '@angular/common/http';
// import { Gitbub } from './gitbub';

export class GitbubAutomodiGo
{
	static go(http:HttpClient)
	{
		let modi:(w)=>void = GitbubAutomodiGo.add_shit
		// GitbubAutomodi.test(http,modi,"mock-world")

		// GitbubAutomodi.update(http,modi,"mock-world") // DANGERZONE
	}

	static add_shit(w) {
		w.text = {
			default_feedback : {
				"go_to":"I went to $$.",
				"look_around":"I looked around. I was at $$.",
				"look_up":"I looked up at the sky. It was almost noon.",
			},
			default_handle : {
				"go_to":"Go to $$",
				"talk_to":"Talk [to|with] $$",
				"look_around":"Look around",
				"_hidden":"...",
				"look_up":"Look up",
			}
		}
	}

	static rename(w) {
		w.aliases[5].alias = "the very crepy cave"
	}

	static rework_aliases(w) {
		let aliases = []
		for ( let key in w.aliases )
			aliases.push({
				key:key.replace('<','').replace('>',''),
				alias:w.aliases[key],
				type:"location"
			})
		w.aliases = aliases
	}
}

export class GitbubAutomodi
{
	static ALL_BRANCHES:string[] = ["master","develop","poc","lorem"]
	// loaded object from each branch will be passed to your function for modification, then saved
	public static update(http:HttpClient,func:(o)=>void,filename:string,branches:string[]=GitbubAutomodi.ALL_BRANCHES)
	{
		// for ( let branch of branches )
		// {
		// 	let f = new Gitbub(http)
		// 	f.load(filename,branch,(data)=>{
		// 		// console.log(f)
		// 		func(data)
		// 		f.save(()=>console.log("SAVED DATA\n",data))
		// 	})
		// }
	}
	// loaded object from branch will be passed to your function for modification, then logged
	public static test(http:HttpClient,func:(o)=>void,filename:string,branches:string[]=GitbubAutomodi.ALL_BRANCHES)
	{
		// for ( let branch of branches )
		// {
		// 	let f = new Gitbub(http)
		// 	f.load(filename,branch,(data)=>{
		// 		func(data)
		// 		console.log("MODIFIED DATA\n",data)
		// 	})
		// }
	}
}