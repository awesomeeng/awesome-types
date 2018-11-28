``// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const V8 = require("v8");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const LockableBuffer = require("./LockableBuffer");

const MAX_SIZE = 536870912;

const $BUFFER = Symbol("view");
const $VIEW = Symbol("view");
const $HEADER = Symbol("header");
const $BODY = Symbol("body");
const $LOCK = Symbol("lock");

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

	constructor(size=65536) {
		if (size===undefined || size===null) throw new Error("Missing size.");
		if (typeof size!=="number") throw new Error("Invalid size.");
		if (size<0 || size>MAX_SIZE) throw new Error("size '"+size+"' must be >= 0 and <= "+MAX_SIZE+".");

		this[$BUFFER] = new LockableBuffer(12+size);
		this[$VIEW] = new Uint8Array(this[$BUFFER]);
		this[$HEADER] = new Uint32Array(this[$BUFFER],0,3);
		this[$BODY] = new Uint8Array(this[$BUFFER],12,size);

		this[$VIEW].fill(0,0,16);

		this[$HEADER][0] = size; 		// Size
		this[$HEADER][1] = 0; 			// Start
		this[$HEADER][2] = 0;			// End
	}

	get underlyingBuffer() {
		return this[$BUFFER];
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

		let view = this[$BODY];
		let header = this[$HEADER];
		let start = this.start;

		let heading = Buffer.from(view.slice(start,start+5));
		let length = heading.readUInt32BE(0);
		start += 5;

		let avail = view.length-start;
		let data = Buffer.from(view.slice(start,start+Math.min(avail,length)));
		if (length>data.length) data = Buffer.concat([data,Buffer.from(view.slice(0,length-avail))]);
		let end = (start+length)%view.length;

		let serialized = heading.readUInt8(4);
		if (serialized) data = V8.deserialize(data);
		else data = Buffer.from(data);

		header[1] = end; // set start to where we end.

		this[$BUFFER].unlock();

		return data;
	}

	readWait() {
		if (!this.hasData()) return undefined;

		return new Promise(async (resolve,reject)=>{
			try {
				let lock = await this[$BUFFER].waitForLock();
				if (!lock) return resolve(undefined);

				let view = this[$BODY];
				let header = this[$HEADER];
				let start = this.start;

				let heading = Buffer.from(view.slice(start,start+5));
				let length = heading.readUInt32BE(0);
				start += 5;

				let avail = view.length-start;
				let data = Buffer.from(view.slice(start,start+Math.min(avail,length)));
				if (length>data.length) data = Buffer.concat([data,Buffer.from(view.slice(0,length-avail))]);
				let end = (start+length)%view.length;

				let serialized = heading.readUInt8(4);
				if (serialized) data = V8.deserialize(data);
				else data = Buffer.from(data);

				header[1] = end; // set start to where we end.

				this[$BUFFER].unlock();

				resolve(data);
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	write(data,frequency=1,timeout=100) {
		if (data===undefined || data===null) throw new Error("Missing data.");

		return new Promise(async (resolve,reject)=>{
			try {
				let lock = await this[$BUFFER].waitForLock(frequency,timeout);
				if (!lock) return reject("Timed out.");

				let view = this[$BODY];
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

				if (chunk.length>view.length) throw new Error("Data to big to write to right view.");

				let avail = view.length-end;
				view.set(chunk.slice(0,Math.min(avail,length)),end);
				if (length>avail) view.set(chunk.slice(avail),0);
				end = (end+length)%view.length;

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
			view: this[$VIEW][Symbol.for('nodejs.util.inspect.custom')](),
			body: this[$BODY][Symbol.for('nodejs.util.inspect.custom')]()
		};
		return obj;
	}
}

module.exports = LockableCircularBuffer;
