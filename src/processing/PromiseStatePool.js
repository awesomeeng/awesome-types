// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $POOL = Symbol("pool");

class PromiseStatePool {
	constructor() {
		this[$POOL] = {};
	}

	get states() {
		return Object.keys(this[$POOL]);
	}

	get length() {
		return Object.values(this[$POOL]).reduce((l,stated)=>{
			return l + stated.length;
		},0);
	}

	add(state,resolve=()=>{},reject=()=>{}) {
		if (!state) throw new Error("Missing state.");
		if (typeof state!=="string") throw new Error("Invalid state; must be a string.");
		if (!resolve) throw new Error("Missing resolve function.");
		if (!(resolve instanceof Function)) throw new Error("Invalid resolve function.");
		if (!reject) throw new Error("Missing reject function.");
		if (!(reject instanceof Function)) throw new Error("Invalid reject function.");

		let stated = this[$POOL][state] || [];
		stated.push({state,resolve,reject});
		this[$POOL][state] = stated;
	}

	remove(state,resolve=()=>{},reject=()=>{}) {
		if (!state) throw new Error("Missing state.");
		if (typeof state!=="string") throw new Error("Invalid state; must be a string.");
		if (!resolve) throw new Error("Missing resolve function.");
		if (!(resolve instanceof Function)) throw new Error("Invalid resolve function.");
		if (!reject) throw new Error("Missing reject function.");
		if (!(reject instanceof Function)) throw new Error("Invalid reject function.");

		let stated = this[$POOL][state] || [];
		stated = stated.filter((p)=>{
			if (state===p.state && resolve===p.resolve && reject===p.reject) return false;
			return true;
		});
		if (stated.length>0) this[$POOL][state] = stated;
		else delete this[$POOL][state];
	}

	resolve(state,arg=undefined) {
		if (!state) throw new Error("Missing state.");
		if (typeof state!=="string") throw new Error("Invalid state; must be a string.");

		let stated = this[$POOL][state] || [];
		delete this[$POOL][state];

		stated.forEach((p)=>{
			if (arg!==undefined) p.resolve(arg);
			else p.resolve();
		});
	}

	resolveAll(arg=undefined) {
		Object.keys(this[$POOL]).forEach((state)=>{
			this.resolve(state,arg);
		});
		this[$POOL] = {};
	}

	reject(state,arg=undefined) {
		if (!state) throw new Error("Missing state.");
		if (typeof state!=="string") throw new Error("Invalid state; must be a string.");

		let stated = this[$POOL][state] || [];
		delete this[$POOL][state];

		stated.forEach((p)=>{
			if (arg!==undefined) p.reject(arg);
			else p.reject();
		});
	}

	rejectAll(arg=undefined) {
		Object.keys(this[$POOL]).forEach((state)=>{
			this.reject(state,arg);
		});
		this[$POOL] = {};
	}

	resolveAndReject(state,resolveArg=undefined,rejectArg=undefined) {
		if (!state) throw new Error("Missing state.");
		if (typeof state!=="string") throw new Error("Invalid state; must be a string.");

		this.resolve(state,resolveArg);
		this.rejectAll(rejectArg);
	}
}

module.exports = PromiseStatePool;
