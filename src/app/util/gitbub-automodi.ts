import { HttpClient } from '@angular/common/http';
import { Gitbub } from './gitbub';

export class GitbubAutomodiGo
{
	static go(http:HttpClient)
	{
		return;

		let modi:(w)=>void = GitbubAutomodiGo.rework_aliases
		GitbubAutomodi.test(http,modi,"mock-world")

		// GitbubAutomodi.update(http,modi,"mock-world") // DANGERZONE
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
		for ( let branch of branches )
		{
			let f = new Gitbub(filename,branch,http)
			f.load((data)=>{
				// console.log(f)
				func(data)
				f.save(()=>console.log("SAVED DATA\n",data))
			})
		}
	}
	// loaded object from branch will be passed to your function for modification, then logged
	public static test(http:HttpClient,func:(o)=>void,filename:string,branches:string[]=GitbubAutomodi.ALL_BRANCHES)
	{
		for ( let branch of branches )
		{
			let f = new Gitbub(filename,branch,http)
			f.load((data)=>{
				func(data)
				console.log("MODIFIED DATA\n",data)
			})
		}
	}
}