// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const $BUFFER = Symbol("buffer");
const $VIEW = Symbol("view");
const $LOCK = Symbol("view");

class LockableBuffer {
	constructor(length) {
		if (length===undefined || length===null) throw new Error("Missing length.");
		if (typeof length!=="number") throw new Error("Invalid length.");
		if (length<0) throw new Error("Invalid length; must be >= 0.");

		this[$BUFFER] = new SharedArrayBuffer(length+4);
		this[$VIEW] = new Uint8Array(this[$BUFFER],4);
		this[$LOCK] = new Int32Array(this[$BUFFER],0,1);
	}

	get length() {
		return this[$BUFFER].byteLength-4;
	}

	get buffer() {
		return this[$VIEW];
	}

	get array() {
		return this.buffer;
	}

	locked() {
		return AwesomeUtils.Workers.sabLocked(this[$LOCK],0);
	}

	lock(frequency=1,timeout=100) {
		return AwesomeUtils.Workers.sabLock(this[$LOCK],0,frequency,timeout);

	}

	unlock() {
		return AwesomeUtils.Workers.sabUnlock(this[$LOCK],0);
	}
}

module.exports = LockableBuffer;
