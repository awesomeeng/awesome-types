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
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(0));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1));
		assert(new AwesomeTypes.lockables.LockableCircularBuffer(1024));
	});

	it("getters",function(){
		let buffer =new AwesomeTypes.lockables.LockableCircularBuffer(1000);

		assert.equal(buffer.size,1000);
		assert.equal(buffer.start,0);
		assert.equal(buffer.end,0);
		assert.equal(buffer.used,0);
		assert.equal(buffer.free,1000);
	});

	it("read/write",async function(){
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(1000);

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
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(103);

		let start = 0;
		let end = 0;

		await AwesomeUtils.Promise.series(new Array(10).fill(0),(x,i)=>{
			return new Promise(async (resolve,reject)=>{
				try {
					assert.equal(buffer.used,0);
					assert.equal(buffer.free,103);
					assert.equal(buffer.start,((75*(i))%103));
					assert.equal(buffer.end,((75*(i))%103));

					let data = Buffer.alloc(70).fill(i);
					await buffer.write(data);
					end = (end+75)%103;

					assert.equal(buffer.used,75);
					assert.equal(buffer.free,28);
					assert.equal(buffer.start,((75*(i))%103));
					assert.equal(buffer.end,((75*(i+1))%103));

					let read = await buffer.readWait();
					assert(data.equals(read));
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

	it("serialization",async function(){
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(1024);

		let data = {
			one:1,
			two:2,
			three:{
				four:34
			}
		};
		await buffer.write(data);
		let read = await buffer.readWait();

		assert.deepStrictEqual(data,read);
		assert.notEqual(data,read);
	});

	it("edges",async function(){
		let buffer = new AwesomeTypes.lockables.LockableCircularBuffer(10);

		await AwesomeUtils.Promise.series(new Array(100).fill(0),(x,i)=>{
			return new Promise(async (resolve,reject)=>{
				try {
					let data = Buffer.alloc(4).fill(i);
					await buffer.write(data);
					assert.equal(buffer.used,9);
					assert.equal(buffer.free,1);

					let read = await buffer.readWait();
					assert(data.equals(read));
					assert(read.equals(data));
					assert.equal(buffer.used,0);
					assert.equal(buffer.free,10);

					resolve();
				}
				catch (ex) {
					return reject(ex);
				}
			});
		});
	});


});
