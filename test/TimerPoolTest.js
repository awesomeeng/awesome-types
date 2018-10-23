// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const TimerPool = require("../src/processing/TimerPool");

const assert = require("assert");

describe("TimerPool",function(){
	it("constructor",function(){
		let timerpool = new TimerPool();
		assert(timerpool);
		assert.equal(timerpool.timerCount,0);
		assert.equal(timerpool.nextTimerExecution,null);
	});

	it("addTimer/removeTimer",function(){
		let timerpool = new TimerPool();

		let id = timerpool.addTimer(100,()=>{});
		assert(id);
		assert.equal(timerpool.timerCount,1);
		assert(timerpool.nextTimerExecution>0);

		timerpool.removeTimer(id);
		assert.equal(timerpool.timerCount,0);
		assert.equal(timerpool.nextTimerExecution,null);
	});

	it("removeAllTimers",function(){
		let timerpool = new TimerPool();

		timerpool.addTimer(100,()=>{});
		timerpool.addTimer(100,()=>{});
		timerpool.addTimer(100,()=>{});
		assert.equal(timerpool.timerCount,3);
		assert(timerpool.nextTimerExecution>0);

		timerpool.removeAllTimers();
		assert.equal(timerpool.timerCount,0);
		assert.equal(timerpool.nextTimerExecution,null);
	});

	it("timers",async function(){
		let timerpool = new TimerPool();

		let x = 0;

		timerpool.addTimer(15,()=>{
			x = 1;
		});

		await AwesomeUtils.Promise.sleep(25);

		assert.equal(x,1);
		assert.equal(timerpool.timerCount,0);
		assert.equal(timerpool.nextTimerExecution,null);
	});
});
