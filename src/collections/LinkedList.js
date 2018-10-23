// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $FIRST = Symbol("first");
const $LAST = Symbol("last");
const $LENGTH = Symbol("length");

class LinkedList {
	constructor(...items) {
		this[$FIRST] = null;
		this[$LAST] = null;
		this[$LENGTH] = 0;

		if (items && items.length>0) this.append.apply(this,items);
	}

	get items() {
		return [...this];
	}

	get length() {
		return this[$LENGTH];
	}

	get first() {
		if (this[$FIRST]!==null) return this[$FIRST].item;
		return undefined;
	}

	get last() {
		if (this[$LAST]!==null) return this[$LAST].item;
		return undefined;
	}

	clone() {
		let gnu = new LinkedList();
		gnu.append.apply(gnu,this.items);
		return gnu;
	}

	contains(item) {
		let entry = this[$FIRST];
		while (entry) {
			if (entry.item===item) return true;
			entry = entry.next;
		}
		return false;
	}

	getPosition(item) {
		let entry = this[$FIRST];
		let count = 0;
		while (entry) {
			if (entry.item===item) return count;
			entry = entry.next;
			count += 1;
		}
		return -1;
	}

	getItemAt(position) {
		if (!position && position!==0) throw new Error("Missing position.");
		if (typeof position!=="number") throw new Error("Invalid position; must be a number.");
		if (position<0) throw new Error("Invalid position; must be >= 0.");
		if (position>=this.length) throw new Error("Invalid position; must be < length.");

		let entry = this[$FIRST];
		while (position>0) {
			entry = entry.next;
			position -= 1;
		}
		return entry.item;
	}

	before(item) {
		let entry = seekEntry.call(this,item);
		if (entry && entry.previous) return entry.previous.item;
		return undefined;
	}

	after(item) {
		let entry = seekEntry.call(this,item);
		if (entry && entry.next) return entry.next.item;
		return undefined;
	}

	insertBefore(beforeItem,...items) {
		if (!items || items.length<1) return;

		let beforeEntry = seekEntry.call(this,beforeItem);
		if (!beforeEntry) throw new Error("Item to insertBefore is not in the list.");

		// d,e,f insertBefore b in a,b,c = a,d,e,f,b,c
		let entries,start,end;
		({entries,start,end} = entrify(items));

		start.previous = beforeEntry.previous;
		if(beforeEntry.previous) beforeEntry.previous.next = start;
		beforeEntry.previous = end;
		end.next = beforeEntry;
		if(this[$FIRST]===beforeEntry) this[$FIRST] = start;

		this[$LENGTH] += entries.length;
	}

	insertAfter(afterItem,...items) {
		if (!items || items.length<1) return;

		let afterEntry = seekEntry.call(this,afterItem);
		if (!afterEntry) throw new Error("Item to insertAfter is not in the list.");

		// d,e,f insertAfter b in a,b,c = a,b,d,e,f,c
		let entries,start,end;
		({entries,start,end} = entrify(items));

		start.previous = afterEntry;
		if (afterEntry.next) afterEntry.next.previous = end;
		end.next = afterEntry.next;
		afterEntry.next = start;
		if(this[$LAST]===afterEntry) this[$LAST] = end;

		this[$LENGTH] += entries.length;
	}

	append(...items) {
		if (!items || items.length<1) return;

		let entries,start,end;
		({entries,start,end} = entrify(items));

		start.previous = this[$LAST];
		if (this[$LAST]) this[$LAST].next = start;
		if (!this[$FIRST]) this[$FIRST] = start;
		this[$LAST] = end;

		this[$LENGTH] += entries.length;
	}

	prepend(...items) {
		if (!items || items.length<1) return;

		let entries,start,end;
		({entries,start,end} = entrify(items));

		start.previous = null;
		end.next = this[$FIRST];
		if (this[$FIRST]) this[$FIRST].previous = end;
		this[$FIRST] = start;
		if (!this[$LAST]) this[$LAST] = end;

		this[$LENGTH] += entries.length;
	}

	remove(...items) {
		if (!items || items.length<1) return [];

		let removed = [];
		let entry = this[$FIRST];
		while (entry && items.length>0) {
			if (items.indexOf(entry.item)>-1) {
				if (this[$FIRST]===entry) this[$FIRST] = entry.next;
				if (this[$LAST]===entry) this[$LAST] = entry.previous;
				if (entry.previous && entry.next) {
					entry.previous.next = entry.next;
					entry.next.previous = entry.previous;
				}

				this[$LENGTH] -= 1;

				items = items.filter((item)=>{
					return item!==entry.item;
				});

				removed.push(entry.item);
			}
			entry = entry.next;
		}
		return removed;
	}

	clear() {
		let entry = this[$FIRST];
		while (entry) {
			let next = entry.next;
			entry.next = null;
			entry.previous = null;
			entry = next;
		}

		this[$LENGTH] = 0;
		this[$FIRST] = null;
		this[$LAST] = null;
	}

	push(...items) {
		return this.append.apply(this,items);
	}

	pop() {
		if (!this[$LAST]) return undefined;

		let entry = this[$LAST];

		this[$LAST] = entry.previous;
		if (entry.previous) entry.previous.next = null;
		if (this[$FIRST]===entry) this[$FIRST] = null;

		this[$LENGTH] -= 1;

		return entry.item;
	}

	unshift(...items) {
		return this.prepend.apply(this,items);
	}

	shift() {
		if (!this[$FIRST]) return undefined;

		let entry = this[$FIRST];

		this[$FIRST] = entry.next;
		if (entry.next) entry.next.previous = null;
		if (this[$LAST]===entry) this[$LAST] = null;

		this[$LENGTH] -= 1;

		return entry.item;
	}

	invert() {
		let entry = this[$LAST];
		while (entry) {
			let p = entry.previous;
			let n = entry.next;
			entry.next = p;
			entry.previous = n;
			entry = p;
		}
		[this[$LAST],this[$FIRST]] = [this[$FIRST],this[$LAST]];
	}

	[Symbol.iterator]() {
		let entry = this[$FIRST];

		return {
			next: function() {
				let next = entry;
				entry = entry && entry.next || null;
				return {
					value: next && next.item,
					done: !next
				};
			}
		};
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		return this.constructor.name+" "+JSON.stringify(this.items,null,2);
	}
}

const seekEntry = function seekEntry(item) {
	let entry = this[$FIRST];
	while (entry) {
		if (entry.item===item) return entry;
		entry = entry.next;
	}
	return null;
};

const entrify = function entrify(items) {
	let previous = null;
	let entries = items.map((item)=>{
		let entry = new LinkedListEntry(item);

		entry.previous = previous;
		if (previous) previous.next = entry;

		previous = entry;
		return entry;
	});
	return {entries,start:entries[0],end:entries[Math.max(0,entries.length-1)]};
};

class LinkedListEntry {
	constructor(item) {
		this.previous = null;
		this.next = null;
		this.item = item;
	}
}

module.exports = LinkedList;
