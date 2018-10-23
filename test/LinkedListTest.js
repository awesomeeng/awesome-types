// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("LinkedList",function(){
	it("constructor",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList();
		assert.equal(list.length,0);
		assert.equal(list.first,null);
		assert.equal(list.last,null);

		list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.equal(list.length,4);
		assert.equal(list.first,1);
		assert.equal(list.last,4);
	});

	it("first",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList();
		assert.strictEqual(list.first,undefined);

		list = new AwesomeTypes.collections.LinkedList(1);
		assert.strictEqual(list.first,1);

		list = new AwesomeTypes.collections.LinkedList(3,2,1);
		assert.strictEqual(list.first,3);
	});

	it("last",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList();
		assert.strictEqual(list.last,undefined);

		list = new AwesomeTypes.collections.LinkedList(1);
		assert.strictEqual(list.last,1);

		list = new AwesomeTypes.collections.LinkedList(1,2,3);
		assert.strictEqual(list.last,3);
	});

	it("before",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.strictEqual(list.before(1),undefined);
		assert.strictEqual(list.before(2),1);
		assert.strictEqual(list.before(3),2);
		assert.strictEqual(list.before(4),3);
		assert.strictEqual(list.before(5),undefined);

		list = new AwesomeTypes.collections.LinkedList();
		assert.strictEqual(list.before(1),undefined);
		assert.strictEqual(list.before(2),undefined);
		assert.strictEqual(list.before(3),undefined);
		assert.strictEqual(list.before(4),undefined);
		assert.strictEqual(list.before(5),undefined);
	});

	it("after",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.strictEqual(list.after(1),2);
		assert.strictEqual(list.after(2),3);
		assert.strictEqual(list.after(3),4);
		assert.strictEqual(list.after(4),undefined);
		assert.strictEqual(list.after(5),undefined);

		list = new AwesomeTypes.collections.LinkedList();
		assert.strictEqual(list.after(1),undefined);
		assert.strictEqual(list.after(2),undefined);
		assert.strictEqual(list.after(3),undefined);
		assert.strictEqual(list.after(4),undefined);
		assert.strictEqual(list.after(5),undefined);
	});

	it("contains",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert(list.contains(1));
		assert(list.contains(2));
		assert(list.contains(3));
		assert(list.contains(4));
		assert(!list.contains(5));
		assert(!list.contains(null));
		assert(!list.contains(undefined));
		assert(!list.contains(-1));
		assert(!list.contains(false));
		assert(!list.contains(true));
	});

	it("invert",function(){
		let list;

		list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.equal(list.length,4);
		assert.equal(list.first,1);
		assert.equal(list.last,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		list.invert();
		assert.equal(list.length,4);
		assert.equal(list.first,4);
		assert.equal(list.last,1);
		assert.deepStrictEqual(list.items,[4,3,2,1]);

		list.invert();
		assert.equal(list.length,4);
		assert.equal(list.first,1);
		assert.equal(list.last,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);
	});

	it("append",function(){
		let list = new AwesomeTypes.collections.LinkedList();

		list.append(0,1,2,3,4);
		assert.equal(list.length,5);
		assert.deepStrictEqual(list.items,[0,1,2,3,4]);

		list.append(5,6,7,8);
		assert.equal(list.length,9);
		assert.deepStrictEqual(list.items,[0,1,2,3,4,5,6,7,8]);

		list.append(1,3,5,7);
		assert.equal(list.length,13);
		assert.deepStrictEqual(list.items,[0,1,2,3,4,5,6,7,8,1,3,5,7]);

		// tests to make sure our directional integrity is valid.
		list.invert();
		assert.deepStrictEqual(list.items,[7,5,3,1,8,7,6,5,4,3,2,1,0]);
	});

	it("prepend",function(){
		let list = new AwesomeTypes.collections.LinkedList();

		list.prepend(0,1,2,3,4);
		assert.equal(list.length,5);
		assert.deepStrictEqual(list.items,[0,1,2,3,4]);

		list.prepend(5,6,7,8);
		assert.equal(list.length,9);
		assert.deepStrictEqual(list.items,[5,6,7,8,0,1,2,3,4]);

		list.prepend(1,3,5,7);
		assert.equal(list.length,13);
		assert.deepStrictEqual(list.items,[1,3,5,7,5,6,7,8,0,1,2,3,4]);

		// tests to make sure our directional integrity is valid.
		list.invert();
		assert.deepStrictEqual(list.items,[4,3,2,1,0,8,7,6,5,7,5,3,1]);
	});

	it("insertAfter",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);

		list.insertAfter(2,10,11,12);
		assert.equal(list.length,7);
		assert.deepStrictEqual(list.items,[1,2,10,11,12,3,4]);

		list.insertAfter(4,20,21,22);
		assert.equal(list.length,10);
		assert.deepStrictEqual(list.items,[1,2,10,11,12,3,4,20,21,22]);

		list.insertAfter(1,30,31,32);
		assert.equal(list.length,13);
		assert.deepStrictEqual(list.items,[1,30,31,32,2,10,11,12,3,4,20,21,22]);

		assert.throws(()=>{
			list.insertAfter(100,101,102,103);
		});

		// tests to make sure our directional integrity is valid.
		list.invert();
		assert.deepStrictEqual(list.items,[22,21,20,4,3,12,11,10,2,32,31,30,1]);
	});

	it("insertBefore",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);

		list.insertBefore(2,10,11,12);
		assert.equal(list.length,7);
		assert.deepStrictEqual(list.items,[1,10,11,12,2,3,4]);

		list.insertBefore(4,20,21,22);
		assert.equal(list.length,10);
		assert.deepStrictEqual(list.items,[1,10,11,12,2,3,20,21,22,4]);

		list.insertBefore(1,30,31,32);
		assert.equal(list.length,13);
		assert.deepStrictEqual(list.items,[30,31,32,1,10,11,12,2,3,20,21,22,4]);

		assert.throws(()=>{
			list.insertBefore(100,101,102,103);
		});

		// tests to make sure our directional integrity is valid.
		list.invert();
		assert.deepStrictEqual(list.items,[4,22,21,20,3,2,12,11,10,1,32,31,30]);
	});

	it("remove",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		list.remove(2);
		assert.deepStrictEqual(list.items,[1,3,4]);

		list.remove(1,3);
		assert.deepStrictEqual(list.items,[4]);

		list.remove(1,3);
		assert.deepStrictEqual(list.items,[4]);

		list.remove(17);
		assert.deepStrictEqual(list.items,[4]);

		list.remove(4);
		assert.deepStrictEqual(list.items,[]);
	});

	it("push",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		list.push(5);
		assert.deepStrictEqual(list.items,[1,2,3,4,5]);

		list.push(6,7,8);
		assert.deepStrictEqual(list.items,[1,2,3,4,5,6,7,8]);

		list.push();
		assert.deepStrictEqual(list.items,[1,2,3,4,5,6,7,8]);
	});

	it("pop",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		assert.equal(list.pop(),4);
		assert.deepStrictEqual(list.items,[1,2,3]);

		assert.equal(list.pop(),3);
		assert.deepStrictEqual(list.items,[1,2]);

		assert.equal(list.pop(),2);
		assert.deepStrictEqual(list.items,[1]);

		assert.equal(list.pop(),1);
		assert.deepStrictEqual(list.items,[]);

		assert.equal(list.pop(),undefined);
	});

	it("unshift",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		list.unshift(5);
		assert.deepStrictEqual(list.items,[5,1,2,3,4]);

		list.unshift(6,7,8);
		assert.deepStrictEqual(list.items,[6,7,8,5,1,2,3,4]);

		list.unshift();
		assert.deepStrictEqual(list.items,[6,7,8,5,1,2,3,4]);
	});

	it("shift",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		assert.equal(list.shift(),1);
		assert.deepStrictEqual(list.items,[2,3,4]);

		assert.equal(list.shift(),2);
		assert.deepStrictEqual(list.items,[3,4]);

		assert.equal(list.shift(),3);
		assert.deepStrictEqual(list.items,[4]);

		assert.equal(list.shift(),4);
		assert.deepStrictEqual(list.items,[]);

		assert.equal(list.shift(),undefined);
	});

	it("clone",function(){
		let list1,list2;

		list1 = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		list2 = list1.clone();
		assert.deepStrictEqual(list1.items,list2.items);

		list2.insertBefore(3,10,11,12);
		assert.deepStrictEqual(list1.items,[1,2,3,4]);
		assert.deepStrictEqual(list2.items,[1,2,10,11,12,3,4]);

		list1.invert();
		assert.deepStrictEqual(list1.items,[4,3,2,1]);
		assert.deepStrictEqual(list2.items,[1,2,10,11,12,3,4]);
	});

	it("getPosition",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		assert.equal(list.getPosition(1),0);
		assert.equal(list.getPosition(2),1);
		assert.equal(list.getPosition(3),2);
		assert.equal(list.getPosition(4),3);
		assert.equal(list.getPosition(5),-1);
		assert.equal(list.getPosition(123451234),-1);
		assert.equal(list.getPosition("asdf"),-1);
		assert.equal(list.getPosition(true),-1);
		assert.equal(list.getPosition("asdf"),-1);
		assert.equal(list.getPosition(null),-1);
	});

	it("getItemAt",function(){
		let list = new AwesomeTypes.collections.LinkedList(1,2,3,4);
		assert.deepStrictEqual(list.items,[1,2,3,4]);

		assert.equal(list.getItemAt(3),4);
		assert.equal(list.getItemAt(2),3);
		assert.equal(list.getItemAt(1),2);
		assert.equal(list.getItemAt(0),1);

		assert.throws(()=>{
			list.getItemAt(-1);
		});
		assert.throws(()=>{
			list.getItemAt(999);
		});
	});



});
