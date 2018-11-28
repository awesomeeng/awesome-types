// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("CircularBuffer",function(){
	it("construtor",function(){
		assert(new AwesomeTypes.collections.CircularBuffer());
		assert(new AwesomeTypes.collections.CircularBuffer(0));
		assert(new AwesomeTypes.collections.CircularBuffer(1));
		assert(new AwesomeTypes.collections.CircularBuffer(1024));
	});

	it("getters",function(){
		let buffer =new AwesomeTypes.collections.CircularBuffer(1000);

		assert.equal(buffer.size,1000);
		assert.equal(buffer.start,0);
		assert.equal(buffer.end,0);
		assert.equal(buffer.used,0);
		assert.equal(buffer.free,1000);
	});

	it("read/write",function(){
		let buffer =new AwesomeTypes.collections.CircularBuffer(1000);

		let data = Buffer.alloc(500).fill(255);
		buffer.write(data);

		assert.equal(buffer.size,1000);
		assert.equal(buffer.start,0);
		assert.equal(buffer.end,505);
		assert.equal(buffer.used,505);
		assert.equal(buffer.free,495);

		assert(buffer.hasData());

		let read = buffer.read();
		assert(read.equals(data));

		assert.equal(buffer.used,0);
		assert.equal(buffer.free,1000);
	});

	it("circular read/write",function(){
		let buffer = new AwesomeTypes.collections.CircularBuffer(103);

		let start = 0;
		let end = 0;
		new Array(10).fill(0).forEach((x,i)=>{
			assert.equal(buffer.used,0);
			assert.equal(buffer.free,103);
			assert.equal(buffer.start,((75*(i))%103));
			assert.equal(buffer.end,((75*(i))%103));

			let data = Buffer.alloc(70).fill(i+1);
			buffer.write(data);
			end = (end+75)%103;

			assert.equal(buffer.used,75);
			assert.equal(buffer.free,28);
			assert.equal(buffer.start,((75*(i))%103));
			assert.equal(buffer.end,((75*(i+1))%103));

			let read = buffer.read();
			assert(read.equals(data));
			start = (start+75)%103;

			assert.equal(buffer.used,0);
			assert.equal(buffer.free,103);
			assert.equal(buffer.start,((75*(i+1))%103));
			assert.equal(buffer.end,((75*(i+1))%103));
		});
	});

	it("serialization",async function(){
		let buffer = new AwesomeTypes.collections.CircularBuffer(1024);

		let data = {
			one:1,
			two:2,
			three:{
				four:34
			}
		};
		await buffer.write(data);
		let read = await buffer.read();

		assert.deepStrictEqual(data,read);
		assert.notEqual(data,read);
	});
});
