// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("Queue",function(){
	let items = (queue)=>{
		let items = [];
		while (queue.length>0) {
			items.push(queue.dequeue());
		}
		queue.enqueue.apply(queue,items);
		return items;
	};

	it("constructor",function(){
		let queue;

		queue = new AwesomeTypes.collections.Queue();
		assert.equal(queue.length,0);

		queue = new AwesomeTypes.collections.Queue(1,2,3,4);
		assert.equal(queue.length,4);
	});

	it("peek",function(){
		let queue;

		queue = new AwesomeTypes.collections.Queue();
		assert.strictEqual(queue.peek(),undefined);

		queue = new AwesomeTypes.collections.Queue(1);
		assert.strictEqual(queue.peek(),1);

		queue = new AwesomeTypes.collections.Queue(1,2,3);
		assert.strictEqual(queue.peek(),1);
	});

	it("enqueue",function(){
		let queue = new AwesomeTypes.collections.Queue(1,2,3,4);
		assert.deepStrictEqual(items(queue),[1,2,3,4]);

		queue.enqueue(5);
		assert.deepStrictEqual(items(queue),[1,2,3,4,5]);

		queue.enqueue(6,7,8);
		assert.deepStrictEqual(items(queue),[1,2,3,4,5,6,7,8]);

		queue.enqueue();
		assert.deepStrictEqual(items(queue),[1,2,3,4,5,6,7,8]);
	});

	it("dequeue",function(){
		let queue = new AwesomeTypes.collections.Queue(1,2,3,4);
		assert.deepStrictEqual(items(queue),[1,2,3,4]);

		assert.equal(queue.dequeue(),1);
		assert.deepStrictEqual(items(queue),[2,3,4]);

		assert.equal(queue.dequeue(),2);
		assert.deepStrictEqual(items(queue),[3,4]);

		assert.equal(queue.dequeue(),3);
		assert.deepStrictEqual(items(queue),[4]);

		assert.equal(queue.dequeue(),4);
		assert.deepStrictEqual(items(queue),[]);

		assert.equal(queue.dequeue(),undefined);
	});

	it("clone",function(){
		let queue1,queue2;

		queue1 = new AwesomeTypes.collections.Queue(1,2,3,4);
		queue2 = queue1.clone();
		assert.deepStrictEqual(items(queue1),items(queue2));

		queue2.enqueue(10,11,12);
		assert.deepStrictEqual(items(queue1),[1,2,3,4]);
		assert.deepStrictEqual(items(queue2),[1,2,3,4,10,11,12]);

		queue1.dequeue();
		assert.deepStrictEqual(items(queue1),[2,3,4]);
		assert.deepStrictEqual(items(queue2),[1,2,3,4,10,11,12]);
	});


});
