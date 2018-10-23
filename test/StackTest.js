// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("Stack",function(){
	let items = (stack)=>{
		let items = [];
		while (stack.length>0) {
			items.unshift(stack.pop());
		}
		stack.push.apply(stack,items);
		return items;
	};

	it("constructor",function(){
		let stack;

		stack = new AwesomeTypes.collections.Stack();
		assert.equal(stack.length,0);
		assert.deepStrictEqual(items(stack),[]);

		stack = new AwesomeTypes.collections.Stack(1,2,3,4);
		assert.equal(stack.length,4);
		assert.deepStrictEqual(items(stack),[1,2,3,4]);
	});

	it("peek",function(){
		let stack;

		stack = new AwesomeTypes.collections.Stack();
		assert.strictEqual(stack.peek(),undefined);

		stack = new AwesomeTypes.collections.Stack(1);
		assert.strictEqual(stack.peek(),1);

		stack = new AwesomeTypes.collections.Stack(1,2,3);
		assert.strictEqual(stack.peek(),3);
	});

	it("push",function(){
		let stack = new AwesomeTypes.collections.Stack(1,2,3,4);
		assert.deepStrictEqual(items(stack),[1,2,3,4]);

		stack.push(5);
		assert.deepStrictEqual(items(stack),[1,2,3,4,5]);

		stack.push(6,7,8);
		assert.deepStrictEqual(items(stack),[1,2,3,4,5,6,7,8]);

		stack.push();
		assert.deepStrictEqual(items(stack),[1,2,3,4,5,6,7,8]);
	});

	it("pop",function(){
		let stack = new AwesomeTypes.collections.Stack(1,2,3,4);
		assert.deepStrictEqual(items(stack),[1,2,3,4]);

		assert.equal(stack.pop(),4);
		assert.deepStrictEqual(items(stack),[1,2,3]);

		assert.equal(stack.pop(),3);
		assert.deepStrictEqual(items(stack),[1,2]);

		assert.equal(stack.pop(),2);
		assert.deepStrictEqual(items(stack),[1]);

		assert.equal(stack.pop(),1);
		assert.deepStrictEqual(items(stack),[]);

		assert.equal(stack.pop(),undefined);
	});

	it("clear",function(){
		let stack = new AwesomeTypes.collections.Stack(1,2,3,4);
		assert.deepStrictEqual(items(stack),[1,2,3,4]);
		assert.equal(stack.length,4);

		stack.clear();
		assert.deepStrictEqual(items(stack),[]);
		assert.equal(stack.length,0);
	});

	it("clone",function(){
		let stack1,stack2;

		stack1 = new AwesomeTypes.collections.Stack(1,2,3,4);
		stack2 = stack1.clone();
		assert.deepStrictEqual(items(stack1),items(stack2));

		stack2.push(10,11,12);
		assert.deepStrictEqual(items(stack1),[1,2,3,4]);
		assert.deepStrictEqual(items(stack2),[1,2,3,4,10,11,12]);

		stack1.pop();
		assert.deepStrictEqual(items(stack1),[1,2,3]);
		assert.deepStrictEqual(items(stack2),[1,2,3,4,10,11,12]);
	});


});
