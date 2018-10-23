// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const SortedList = require("../collections/SortedList");

const $POOL = Symbol("pool");
const $MINTIMER = Symbol("minimumTimer");
const $EXECTIMER = Symbol("minimumTimer");

let sequence = 0;

class TimerPool {
	constructor(minimumTimer=10) {
		if (!minimumTimer && minimumTimer!==0) throw new Error("Missing minimumTimer.");
		if (typeof minimumTimer!=="number") throw new Error("Invalid minimumTimer; must be a number.");

		this[$POOL] = new SortedList();
		this[$MINTIMER] = Math.max(0,minimumTimer);

		this[$POOL].comparator = comparator;
	}

	get minimumTimer() {
		return this[$MINTIMER];
	}

	get nextTimerExecution() {
		let next = this[$POOL].first;
		if (!next) return;

		return next.at;
	}

	get timerCount() {
		return this[$POOL].length;
	}

	addTimer(ms,f) {
		let id = ++sequence;

		this[$POOL].add({
			id,
			at: Date.now()+ms,
			run: f
		});

		schedule.call(this);

		return id;
	}

	removeTimer(id) {
		let entry = this[$POOL].items.reduce((answer,entry)=>{
			if (answer) return answer;
			if (entry.id===id) return entry;
			return null;
		},null);
		if (!entry) return false;

		this[$POOL].remove(entry);

		schedule.call(this);

		return true;
	}

	removeAllTimers() {
		this[$POOL].clear();

		schedule.call(this);
	}
}

const comparator = function comparator(a,b) {
	return AwesomeUtils.Comparator.numberCompare(a && a.ms || null, b && b.ms || null);
};

const schedule = function schedule() {
	if (this[$EXECTIMER]) clearTimeout(this[$EXECTIMER]);

	let next = this[$POOL].first;
	if (!next) return;

	let ms = Math.max(this[$MINTIMER],Date.now()-next.at);
	this[$EXECTIMER] = setTimeout(execute.bind(this),ms,next);
};

const execute = function execute(entry) {
	clearTimeout(this[$EXECTIMER]);

	this[$POOL].remove(entry);
	setImmediate(entry.run);

	schedule.call(this);
};

module.exports = TimerPool;
