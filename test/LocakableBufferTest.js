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

	it("length",function(){
		let buffer;

		buffer = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert.equal(buffer.length,1024);

		buffer = new AwesomeTypes.lockables.LockableBuffer(0);
		assert.equal(buffer.length,0);

		buffer = new AwesomeTypes.lockables.LockableBuffer(1);
		assert.equal(buffer.length,1);

		assert.throws(()=>{
			buffer = new AwesomeTypes.lockables.LockableBuffer(-1);
		});
	});

	it("buffer",function(){
		let lb = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert(lb.buffer);
		assert(lb.array instanceof Uint8Array);
		assert(lb.buffer.buffer);
		assert(lb.buffer.byteLength);
		assert(lb.buffer.byteOffset);
		assert(lb.buffer.copyWithin);
		assert(lb.buffer.entries);
		assert(lb.buffer.every);
		assert(lb.buffer.fill);
		assert(lb.buffer.filter);
		assert(lb.buffer.find);
		assert(lb.buffer.findIndex);
		assert(lb.buffer.forEach);
		assert(lb.buffer.includes);
		assert(lb.buffer.indexOf);
		assert(lb.buffer.join);
		assert(lb.buffer.keys);
		assert(lb.buffer.lastIndexOf);
		assert(lb.buffer.length);
		assert(lb.buffer.map);
		assert(lb.buffer.reduce);
		assert(lb.buffer.reduceRight);
		assert(lb.buffer.reverse);
		assert(lb.buffer.set);
		assert(lb.buffer.slice);
		assert(lb.buffer.some);
		assert(lb.buffer.sort);
		assert(lb.buffer.subarray);
		assert(lb.buffer.toLocaleString);
		assert(lb.buffer.toString);
		assert(lb.buffer.values);
	});

	it("array",function(){
		let lb = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert(lb.array);
		assert(lb.array instanceof Uint8Array);
		assert(lb.array.buffer);
		assert(lb.array.byteLength);
		assert(lb.array.byteOffset);
		assert(lb.array.copyWithin);
		assert(lb.array.entries);
		assert(lb.array.every);
		assert(lb.array.fill);
		assert(lb.array.filter);
		assert(lb.array.find);
		assert(lb.array.findIndex);
		assert(lb.array.forEach);
		assert(lb.array.includes);
		assert(lb.array.indexOf);
		assert(lb.array.join);
		assert(lb.array.keys);
		assert(lb.array.lastIndexOf);
		assert(lb.array.length);
		assert(lb.array.map);
		assert(lb.array.reduce);
		assert(lb.array.reduceRight);
		assert(lb.array.reverse);
		assert(lb.array.set);
		assert(lb.array.slice);
		assert(lb.array.some);
		assert(lb.array.sort);
		assert(lb.array.subarray);
		assert(lb.array.toLocaleString);
		assert(lb.array.toString);
		assert(lb.array.values);
	});
});
