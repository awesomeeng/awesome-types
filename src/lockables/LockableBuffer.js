// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const $SAB = Symbol("buffer");
const $LOCK = Symbol("view");

class LockableBuffer /*extends Buffer*/ {
	constructor(size) {
		let sab;
		if (size && size instanceof SharedArrayBuffer) {
			sab = size;
			size = sab.size-4;
		}
		else {
			if (size===undefined || size===null) throw new Error("Missing size.");
			if (typeof size!=="number") throw new Error("Invalid size.");
			if (size<0) throw new Error("Invalid size; must be >= 0.");

			sab = new SharedArrayBuffer(size+4);
		}

		this[$SAB] = sab;
		this[$LOCK] = new Int32Array(sab,0,1);

		let b = Buffer.from(sab,4);
		b.underlyingBuffer = this.underlyingBuffer;
		b.locked = this.locked.bind(this);
		b.isLockOwner = this.isLockOwner.bind(this);
		b.lock = this.lock.bind(this);
		b.waitForLock = this.waitForLock.bind(this);
		b.waitLock = this.waitLock.bind(this);
		b.blockUntilLock = this.blockUntilLock.bind(this);
		b.blockLock = this.blockLock.bind(this);
		b.unlock = this.unlock.bind(this);

		return b;
	}

	get underlyingBuffer() {
		return this[$SAB];
	}

	get size() {
		return this[$SAB]-4;
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
