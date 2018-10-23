// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const LinkedList = require("./LinkedList");

const $LIST = Symbol("list");
const $COMPARATOR = Symbol("comparator");

class SortedList {
	static get DefaultComparator() {
		return AwesomeUtils.Comparator.compare;
	}

	static get NumberComparator() {
		return AwesomeUtils.Comparator.numberCompare;
	}

	static get StringComparator() {
		return AwesomeUtils.Comparator.stringCompare;
	}

	static get StringIgnoreCaseComparator() {
		return AwesomeUtils.Comparator.stringIgnoreCaseCompare;
	}

	constructor(...items) {
		this[$LIST] = new LinkedList();
		this[$COMPARATOR] = SortedList.DefaultComparator;
		if (items.length>0) this.add.apply(this,items);
	}

	get items() {
		return this[$LIST].items;
	}

	get length() {
		return this[$LIST].length;
	}

	get comparator() {
		return this[$COMPARATOR];
	}

	set comparator(f) {
		if (!f) f = SortedList.DefaultComparator;
		if (!(f instanceof Function)) throw new Error("Invalid comparator; must be a function.");
		this[$COMPARATOR] = f;
	}

	get first() {
		return this[$LIST].first;
	}

	get last() {
		return this[$LIST].last;
	}

	getFirst(count=1) {
		return this[$LIST].items.slice(0,count);
	}

	getLast(count=1) {
		return this[$LIST].items.slice(-count);
	}

	contains(item) {
		return this[$LIST].contains(item);
	}

	add(...items) {
		items.forEach((item)=>{
			if (item===undefined || item===null) return this[$LIST].unshift(item);

			let first = this[$LIST].first;
			if (first===undefined || (first && this.comparator(first,item)<0)) {
				this[$LIST].unshift(item);
				return this;
			}

			let last = this[$LIST].last;
			if (last && this.comparator(last,item)>0) {
				this[$LIST].push(item);
				return this;
			}

			let all = AwesomeUtils.Array.compact(this.items);
			if (all.length<1) return this[$LIST].push(item);

			let start = 0;
			let end = all.length;
			let pos = -1;
			while (start<end) {
				pos = ((start+end)/2)|0;

				let compared = this.comparator(all[pos],item);
				if (compared<0) end = pos;
				else start = pos+1;
			}
			start -= 1;

			if (start<0) this[$LIST].insertBefore(all[0],item);
			else this[$LIST].insertAfter(all[start],item);
		});
	}

	remove(...items) {
		this[$LIST].remove.apply(this[$LIST],items);
	}

	clear() {
		this[$LIST].clear();
	}

	pop() {
		return this[$LIST].pop();
	}

	shift() {
		return this[$LIST].shift();
	}

	clone() {
		let gnu = new SortedList();
		gnu[$LIST].append.apply(gnu[$LIST],this.items);
		return gnu;
	}

	[Symbol.iterator]() {
		return this[$LIST][Symbol.iterator];
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		return this.constructor.name+" "+JSON.stringify(this.items,null,2);
	}

}

module.exports = SortedList;
