// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const LinkedList = require("./LinkedList");

const $LIST = Symbol("list");

class Queue {
	constructor(...items) {
		this[$LIST] = new LinkedList();
		if (items && items.length>0) this.enqueue.apply(this,items);
	}

	get length() {
		return this[$LIST] && this[$LIST].length || 0;
	}

	clone() {
		let gnu = new Queue();
		gnu.enqueue.apply(gnu,this[$LIST].items);
		return gnu;
	}

	enqueue(...items) {
		return this[$LIST].append.apply(this[$LIST],items);
	}

	peek() {
		return this[$LIST].first;
	}

	dequeue() {
		return this[$LIST].shift();
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		return this.constructor.name+" "+JSON.stringify(this.items,null,2);
	}
}

module.exports = Queue;
