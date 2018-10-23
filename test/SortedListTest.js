// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("SortedList",function(){
	it("constructor",function(){
		let list;

		list = new AwesomeTypes.collections.SortedList();
		assert.equal(list.length,0);
		assert.equal(list.first,null);
		assert.equal(list.last,null);

		list = new AwesomeTypes.collections.SortedList(1,4,2,3);
		assert.equal(list.length,4);
		assert.equal(list.first,1);
		assert.equal(list.last,4);
	});

	it("first",function(){
		let list;

		list = new AwesomeTypes.collections.SortedList();
		assert.strictEqual(list.first,undefined);

		list = new AwesomeTypes.collections.SortedList(1);
		assert.strictEqual(list.first,1);

		list = new AwesomeTypes.collections.SortedList(3,2,1);
		assert.strictEqual(list.first,1);
	});

	it("last",function(){
		let list;

		list = new AwesomeTypes.collections.SortedList();
		assert.strictEqual(list.last,undefined);

		list = new AwesomeTypes.collections.SortedList(1);
		assert.strictEqual(list.last,1);

		list = new AwesomeTypes.collections.SortedList(3,2,1);
		assert.strictEqual(list.last,3);
	});

	it("add",function(){
		let list;

		list = new AwesomeTypes.collections.SortedList();
		assert.deepStrictEqual(list.items,[]);

		list.add(30,10,20);
		assert.deepStrictEqual(list.items,[10,20,30]);

		list.add(40);
		assert.deepStrictEqual(list.items,[10,20,30,40]);

		list.add(0);
		assert.deepStrictEqual(list.items,[0,10,20,30,40]);

		list.add(25);
		assert.deepStrictEqual(list.items,[0,10,20,25,30,40]);

		list.add(25);
		assert.deepStrictEqual(list.items,[0,10,20,25,25,30,40]);
	});

	it("remove",function(){
		let list = new AwesomeTypes.collections.SortedList(2,3,4,1);
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

	it("contains",function(){
		let list;

		list = new AwesomeTypes.collections.SortedList(4,1,2,3);
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

	it("pop",function(){
		let list = new AwesomeTypes.collections.SortedList(4,3,2,1);
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

	it("shift",function(){
		let list = new AwesomeTypes.collections.SortedList(3,4,1,2);
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

		list1 = new AwesomeTypes.collections.SortedList(2,1,3,4);
		list2 = list1.clone();
		assert.deepStrictEqual(list1.items,list2.items);

		list2.add(3,10,11,12);
		assert.deepStrictEqual(list1.items,[1,2,3,4]);
		assert.deepStrictEqual(list2.items,[1,2,3,3,4,10,11,12]);

		list1.add(1.5);
		assert.deepStrictEqual(list1.items,[1,1.5,2,3,4]);
		assert.deepStrictEqual(list2.items,[1,2,3,3,4,10,11,12]);
	});

	it("nulls",function(){
		let list = new AwesomeTypes.collections.SortedList();
		list.add(null,4,2,null,1,3,4,null);
		assert.deepStrictEqual(list.items,[null,null,null,1,2,3,4,4]);
	});

	it("NumberComparator",function(){
		let list = new AwesomeTypes.collections.SortedList();
		list.comparator = AwesomeTypes.collections.SortedList.NumberComparator;

		list.add(7,4,5,2,2,1);
		assert.deepStrictEqual(list.items,[1,2,2,4,5,7]);
	});

	it("StringComparator",function(){
		let list = new AwesomeTypes.collections.SortedList();
		list.comparator = AwesomeTypes.collections.SortedList.StringComparator;

		list.add("aaa","BBB","APE","bad","ape");
		assert.deepStrictEqual(list.items,["APE","BBB","aaa","ape","bad"]);
	});

	it("StringIgnoreCaseComparator",function(){
		let list = new AwesomeTypes.collections.SortedList();
		list.comparator = AwesomeTypes.collections.SortedList.StringIgnoreCaseComparator;

		list.add("aaa","BBB","APE","bad","ape");
		assert.deepStrictEqual(list.items,["aaa","APE","ape","bad","BBB"]);
	});

});
