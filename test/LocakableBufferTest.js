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

	it("inheritance",function(){
		let lb = new AwesomeTypes.lockables.LockableBuffer(1024);
		assert(lb.buffer);
		assert(lb.byteLength);
		assert(lb.byteOffset);
		assert(lb.copyWithin);
		assert(lb.entries);
		assert(lb.every);
		assert(lb.filter);
		assert(lb.find);
		assert(lb.findIndex);
		assert(lb.forEach);
		assert(lb.join);
		assert(lb.keys);
		assert(lb.length);
		assert(lb.map);
		assert(lb.reduce);
		assert(lb.reduceRight);
		assert(lb.reverse);
		assert(lb.set);
		assert(lb.some);
		assert(lb.sort);
		assert(lb.subarray );
		assert(lb.values);
		assert(lb.asciiSlice);
		assert(lb.asciiWrite);
		assert(lb.base64Slice);
		assert(lb.base64Write);
		assert(lb.compare);
		assert(lb.constructor);
		assert(lb.copy);
		assert(lb.equals);
		assert(lb.fill);
		assert(lb.hexSlice );
		assert(lb.hexWrite );
		assert(lb.includes);
		assert(lb.indexOf);
		assert(lb.inspect);
		assert(lb.lastIndexOf);
		assert(lb.latin1Slice);
		assert(lb.latin1Write);
		assert(lb.offset);
		assert(lb.parent);
		assert(lb.readDoubleBE);
		assert(lb.readDoubleLE);
		assert(lb.readFloatBE);
		assert(lb.readFloatLE);
		assert(lb.readInt16BE);
		assert(lb.readInt16LE);
		assert(lb.readInt32BE);
		assert(lb.readInt32LE);
		assert(lb.readInt8);
		assert(lb.readIntBE);
		assert(lb.readIntLE);
		assert(lb.readUInt16BE);
		assert(lb.readUInt16LE);
		assert(lb.readUInt32BE);
		assert(lb.readUInt32LE);
		assert(lb.readUInt8);
		assert(lb.readUIntBE);
		assert(lb.readUIntLE);
		assert(lb.slice);
		assert(lb.swap16);
		assert(lb.swap32);
		assert(lb.swap64);
		assert(lb.toJSON);
		assert(lb.toLocaleString);
		assert(lb.toString);
		assert(lb.ucs2Slice);
		assert(lb.ucs2Write);
		assert(lb.utf8Slice);
		assert(lb.utf8Write);
		assert(lb.write);
		assert(lb.writeDoubleBE);
		assert(lb.writeDoubleLE);
		assert(lb.writeFloatBE);
		assert(lb.writeFloatLE);
		assert(lb.writeInt16BE);
		assert(lb.writeInt16LE);
		assert(lb.writeInt32BE);
		assert(lb.writeInt32LE);
		assert(lb.writeInt8);
		assert(lb.writeIntBE);
		assert(lb.writeIntLE);
		assert(lb.writeUInt16BE);
		assert(lb.writeUInt16LE);
		assert(lb.writeUInt32BE);
		assert(lb.writeUInt32LE);
		assert(lb.writeUInt8);
		assert(lb.writeUIntBE);
		assert(lb.writeUIntLE);
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
