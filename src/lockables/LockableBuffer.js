// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const $SAB = Symbol("buffer");
const $LOCK = Symbol("lock");

class LockableBuffer /*extends Buffer*/ {
	constructor(size) {
		let buffer;
		if (size && size instanceof SharedArrayBuffer) {
			buffer = size;
			size = buffer.byteLength-4;
		}
		else {
			if (size===undefined || size===null) throw new Error("Missing size.");
			if (typeof size!=="number") throw new Error("Invalid size.");
			if (size<0) throw new Error("Invalid size; must be >= 0.");

			buffer = new SharedArrayBuffer(size+4);
		}

		this[$SAB] = buffer;
		this[$LOCK] = new Int32Array(buffer,0,1);
		AwesomeUtils.Workers.initializeLock(this[$LOCK]);

		let view = new Uint8Array(buffer,4);

		return new Proxy(this,{
			has: (target,key)=>{
				return !!target[key] || typeof key==="number" && key>=0 && key<size && !!view[key] || !!view[key] || false;
			},
			get: (target,key)=>{
				return target[key] || typeof key==="number" && key>=0 && key<size && view[key] || view[key] && view[key] instanceof Function && view[key].bind(view) || view[key] || false;
			},
			set: (target,key,value)=>{
				if (typeof key==="number") {
					if (key>=0 && key<size && !!view[key]) {
						view[key] = value;
						return true;
					}
					throw new Error("Index out of bounds; must be >=0 or <"+size+".");
				}
				target[key] = value;
				return true;
			}
		});
	}

	get underlyingBuffer() {
		return this[$SAB];
	}

	get size() {
		return this[$SAB].byteLength-4;
	}

	locked() {
		return AwesomeUtils.Workers.locked(this[$LOCK],0);
	}

	isLockOwner() {
		return AwesomeUtils.Workers.isLockOwner(this[$LOCK],0);
	}

	lock() {
		return AwesomeUtils.Workers.lock(this[$LOCK],0);
	}

	waitForLock(frequency=1,timeout=10) {
		return AwesomeUtils.Workers.waitForLock(this[$LOCK],0,frequency,timeout);
	}

	waitLock(frequency=1,timeout=10) {
		return AwesomeUtils.Workers.waitLock(this[$LOCK],0,frequency,timeout);
	}

	blockUntilLock(frequency=1,timeout=10) {
		return AwesomeUtils.Workers.blockUntilLock(this[$LOCK],0,frequency,timeout);
	}

	blockLock(frequency=1,timeout=10) {
		return AwesomeUtils.Workers.blockLock(this[$LOCK],0,frequency,timeout);
	}

	unlock() {
		return AwesomeUtils.Workers.unlock(this[$LOCK],0);
	}
}

module.exports = LockableBuffer;
