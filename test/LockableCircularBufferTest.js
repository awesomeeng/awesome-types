// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("LockableCircularBuffer",function(){
	it("construtor",function(){
		assert(new AwesomeTypes.lockables.LockableCircularBuffer());
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(0));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1024));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1024*1024));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1024*1024*512));
	});

	it("getters",function(){
		let buffer =new AwesomeTypes.lockables.LockableCircularBuffer(1000,1000);

		assert.equal(buffer.size,1000);
		assert.equal(buffer.start,0);
		assert.equal(buffer.end,0);
		assert.equal(buffer.used,0);
		assert.equal(buffer.free,1000);
	});

	it("read/write",async function(){
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(1000,1000);
		new Uint8Array(buffer.underlyingBuffer).fill(17,16);

		let data = Buffer.alloc(500).fill(255);
		await buffer.write(data);

		assert.equal(buffer.size,1000);
		assert.equal(buffer.start,0);
		assert.equal(buffer.end,505);
		assert.equal(buffer.used,505);
		assert.equal(buffer.free,495);

		assert(buffer.hasData());

		let read = await buffer.read();
		assert(read.equals(data));

		assert.equal(buffer.used,0);
		assert.equal(buffer.free,1000);
	});

	it("circular read/write",async function(){
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(103,103);
		new Uint8Array(buffer.underlyingBuffer).fill(1,16);

		let start = 0;
		let end = 0;

		await AwesomeUtils.Promise.series(new Array(10).fill(0),(x,i)=>{
			return new Promise(async (resolve,reject)=>{
				try {
					assert.equal(buffer.used,0);
					assert.equal(buffer.free,103);
					assert.equal(buffer.start,((75*(i))%103));
					assert.equal(buffer.end,((75*(i))%103));

					let data = Buffer.alloc(70).fill(i+1);
					await buffer.write(data);
					end = (end+75)%103;

					assert.equal(buffer.used,75);
					assert.equal(buffer.free,28);
					assert.equal(buffer.start,((75*(i))%103));
					assert.equal(buffer.end,((75*(i+1))%103));

					let read = await buffer.read();
					assert(read.equals(data));
					start = (start+75)%103;

					assert.equal(buffer.used,0);
					assert.equal(buffer.free,103);
					assert.equal(buffer.start,((75*(i+1))%103));
					assert.equal(buffer.end,((75*(i+1))%103));

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		});
	});

});
