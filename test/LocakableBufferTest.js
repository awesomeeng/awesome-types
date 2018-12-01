// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeTypes = require("../src/AwesomeTypes");

describe("LockableBuffer",function(){
	it("constructor",function(){
		let buffer = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert(buffer);
	});

	it("size",function(){
		let buffer;

		buffer = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert.equal(buffer.size,1024);

		buffer = new AwesomeTypes.lockables.LockableBuffer(0);
		assert.equal(buffer.size,0);

		buffer = new AwesomeTypes.lockables.LockableBuffer(1);
		assert.equal(buffer.size,1);

		assert.throws(()=>{
			buffer = new AwesomeTypes.lockables.LockableBuffer(-1);
		});
	});

	it("read/write",function(){
		let lb = new AwesomeTypes.lockables.LockableBuffer(16);
		lb.fill(0);

		lb[0] = 1;
		lb[1] = 2;
		lb[2] = 3;
		lb[8] = 254;
		lb[15] = 255;

		assert.equal(lb[0],1);
		assert.equal(lb[1],2);
		assert.equal(lb[2],3);
		assert.equal(lb[3],0);
		assert.equal(lb[4],0);
		assert.equal(lb[5],0);
		assert.equal(lb[6],0);
		assert.equal(lb[7],0);
		assert.equal(lb[8],254);
		assert.equal(lb[9],0);
		assert.equal(lb[10],0);
		assert.equal(lb[11],0);
		assert.equal(lb[12],0);
		assert.equal(lb[13],0);
		assert.equal(lb[14],0);
		assert.equal(lb[15],255);
	});
});
