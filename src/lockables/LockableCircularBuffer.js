``// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const V8 = require("v8");

const LockableBuffer = require("./LockableBuffer");

const MAX_SIZE = 536870912;

const $BUFFER = Symbol("buffer");
const $VIEW = Symbol("view");
const $HEADER = Symbol("header");
const $BODY = Symbol("body");

class LockableCircularBuffer {

	// Overall Buffer Structure
	//
	// 0-3 : lock
	// 4-7 : Size
	// 8-13 : Start
	// 12-15 : End

	// Entry Structure
	//
	// 0-3 : length
	// 4: serialized (0=false,1=true)
	// 5+length : content

	static get maximumSize() {
		return MAX_SIZE;
	}

	constructor(size) {
		let buffer;
		if (size && size instanceof SharedArrayBuffer) {
			buffer = new LockableBuffer(size);
			size = buffer.size-12;
		}
		else {
			if (size===undefined || size===null) throw new Error("Missing size.");
			if (typeof size!=="number") throw new Error("Invalid size.");
			if (size<0 || size>MAX_SIZE) throw new Error("size '"+size+"' must be >= 0 and <= "+MAX_SIZE+".");

			buffer = new LockableBuffer(12+size);
			new Uint8Array(buffer).fill(0,4,12);
		}

		this[$BUFFER] = buffer;
		this[$VIEW] = new Uint8Array(buffer.underlyingBuffer);

		this[$HEADER] = new Uint32Array(buffer.underlyingBuffer,4,3);
		this[$BODY] = new Uint8Array(buffer.underlyingBuffer,16);

		this[$HEADER][0] = size; 		// Size
	}

	get underlyingBuffer() {
		return this[$BUFFER].underlyingBuffer;
	}

	get size() {
		return this[$HEADER][0];
	}

	get start() {
		return this[$HEADER][1];
	}

	get end() {
		return this[$HEADER][2];
	}

	get used() {
		let s = this.start;
		let e = this.end;
		return e>=s ? e-s : this.size-s+e;
	}

	get free() {
		return this.size-this.used;
	}

	hasData() {
		return !!this.used;
	}

	read() {
		if (!this.hasData()) return undefined;

		let lock = this[$BUFFER].lock();
		if (!lock) return undefined;

		let body = this[$BODY];
		let header = this[$HEADER];
		let start = this.start;

		let heading = readChunk(body,start,5);
		let length = heading.readUInt32BE(0);
		start = (start+5)%body.length;

		let data = readChunk(body,start,length);
		start = (start+length)%body.length;

		header[1] = start; // set start.

		this[$BUFFER].unlock();

		let serialized = heading.readUInt8(4);
		if (serialized) data = V8.deserialize(data);
		else data = Buffer.from(data);

		return data;
	}

	readWait(frequency=1,timeout=10) {
		if (typeof frequency!=="number") throw new Error("Invalid frequency; must be a number.");
		if (typeof timeout!=="number") throw new Error("Invalid timeout; must be a number.");

		if (!this.hasData()) return undefined;

		return new Promise(async (resolve,reject)=>{
			try {
				let lock = await this[$BUFFER].waitForLock(frequency,timeout);
				if (!lock) return resolve(undefined);

				let body = this[$BODY];
				let header = this[$HEADER];
				let start = this.start;

				let heading = readChunk(body,start,5);
				let length = heading.readUInt32BE(0);
				start = (start+5)%body.length;

				let data = readChunk(body,start,length);
				start = (start+length)%body.length;

				header[1] = start; // set start

				this[$BUFFER].unlock();

				let serialized = heading.readUInt8(4);
				if (serialized) data = V8.deserialize(data);
				else data = Buffer.from(data);

				resolve(data);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	write(data,frequency=1,timeout=100) {
		if (data===undefined || data===null) throw new Error("Missing data.");
		if (typeof frequency!=="number") throw new Error("Invalid frequency; must be a number.");
		if (typeof timeout!=="number") throw new Error("Invalid timeout; must be a number.");

		return new Promise(async (resolve,reject)=>{
			try {
				let body = this[$BODY];
				let header = this[$HEADER];
				let end = this.end;
				if (data===undefined || data===null) throw new Error("Missing data.");

				let serialized = 0;
				if (!(data instanceof Buffer)) {
					serialized = 1;
					data = V8.serialize(data);
				}

				let chunk = Buffer.concat([Buffer.alloc(5),data]);
				let length = chunk.length;
				chunk.writeUInt32BE(data.length,0);
				chunk.writeUInt8(serialized,4);

				if (chunk.length>this.free) throw new Error("Write of "+length+" bytes would exceed buffer free space of "+this.free+" bytes.");

				let lock = await this[$BUFFER].waitForLock(frequency,timeout);
				if (!lock) return reject("Timed out.");

				let avail = body.length-end;
				body.set(chunk.slice(0,Math.min(avail,length)),end);
				if (length>avail) body.set(chunk.slice(avail),0);
				end = (end+length)%body.length;

				header[2] = end; // set ends to where we end.

				this[$BUFFER].unlock();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		let obj = {};
		obj[this.constructor.name] = {
			size: this.size,
			start: this.start,
			end: this.end,
			used: this.used,
			free: this.free,
			view: this[$VIEW],
			body: this[$BODY]
		};
		return obj;
	}
}

/**
 * @private
 *
 * Read a chunk of data from the buffer in a circular manner.
 *
 * @param  {Uint8Array} buffer
 * @param  {number} start
 * @param  {number} length
 * @return {Buffer}
 */
const readChunk = function readChunk(buffer,start,length) {
	let avail = buffer.length-start;
	let data = Buffer.from(buffer.slice(start,start+Math.min(avail,length)));
	if (length>data.length) data = Buffer.concat([data,Buffer.from(buffer.slice(0,length-avail))]);
	return data;
};

module.exports = LockableCircularBuffer;
