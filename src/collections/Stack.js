// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LinkedList = require("./LinkedList");

const $LIST = Symbol("list");

class Stack {
	constructor(...items) {
		this[$LIST] = new LinkedList();
		if (items && items.length>0) this.push.apply(this,items);
	}

	get length() {
		return this[$LIST] && this[$LIST].length || 0;
	}

	clone() {
		let gnu = new Stack();
		gnu.push.apply(gnu,this[$LIST].items);
		return gnu;
	}

	push(...items) {
		return this[$LIST].push.apply(this[$LIST],items);
	}

	peek() {
		return this[$LIST].last;
	}

	pop() {
		return this[$LIST].pop();
	}

	clear() {
		return this[$LIST].clear();
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		return this.constructor.name+" "+JSON.stringify(this.items,null,2);
	}
}

module.exports = Stack;
