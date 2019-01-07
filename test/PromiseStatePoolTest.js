// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const PromiseStatePool = require("../src/processing/PromiseStatePool");

describe("PromiseStatePool",function(){
	it("add/remove",function(){
		let pool = new PromiseStatePool();
		let rs,rj;

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		});
		assert.equal(1,pool.length);

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		});
		assert.equal(2,pool.length);

		new Promise((resolve,reject)=>{
			rs = resolve;
			rj = reject;
			pool.add("test2",resolve,reject);
		});
		assert.equal(3,pool.length);
		assert.deepStrictEqual(["test1","test2"],pool.states);

		pool.remove("test2",rs,rj);
		assert.equal(2,pool.length);
		assert.deepStrictEqual(["test1"],pool.states);
	});

	it("resolve",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			done();
		}).catch(()=>{
			assert.fail("rejected when it should have resolved.");
		});
		pool.resolve("test1");
		assert.equal(0,pool.length);
	});

	it("resolve with argument",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then((x)=>{
			assert.equal(1234,x);
			done();
		}).catch(()=>{
			assert.fail("rejected when it should have resolved.");
		});
		pool.resolve("test1",1234);
		assert.equal(0,pool.length);
	});

	it("resolveAll",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			done();
		}).catch(()=>{
			assert.fail("rejected when it should have resolved.");
		});
		pool.resolveAll();
		assert.equal(0,pool.length);
	});

	it("resolveAll with argument",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then((x)=>{
			assert.equal(1234,x);
			done();
		}).catch(()=>{
			assert.fail("rejected when it should have resolved.");
		});
		pool.resolveAll(1234);
		assert.equal(0,pool.length);
	});

	it("reject",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			assert.fail("resolved when it should have rejected.");
		}).catch(()=>{
			done();
		});
		pool.reject("test1");
		assert.equal(0,pool.length);
	});

	it("reject with argument",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			assert.fail("resolved when it should have rejected.");
		}).catch((x)=>{
			assert.equal(1234,x);
			done();
		});
		pool.reject("test1",1234);
		assert.equal(0,pool.length);
	});

	it("rejectAll",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			assert.fail("resolved when it should have rejected.");
		}).catch(()=>{
			done();
		});
		pool.rejectAll();
		assert.equal(0,pool.length);
	});

	it("rejectAll with argument",function(done){
		let pool = new PromiseStatePool();

		new Promise((resolve,reject)=>{
			pool.add("test1",resolve,reject);
		}).then(()=>{
			assert.fail("resolved when it should have rejected.");
		}).catch((x)=>{
			assert.equal(1234,x);
			done();
		});
		pool.rejectAll(1234);
		assert.equal(0,pool.length);
	});

	it("resolveAndReject",function(){
		let pool = new PromiseStatePool();

		let x = 2;
		pool.add("test1",()=>{
			x += 3;
		},()=>{
			x += 4;
		});
		pool.add("test2",()=>{
			x += 5;
		},()=>{
			x += 6;
		});
		pool.add("test2",()=>{
			x += 7;
		},()=>{
			x += 8;
		});
		pool.resolveAndReject("test2");
		assert.equal(18,x); // 2+5+7+4
	});

	it("resolveAndReject with arguments",function(){
		let pool = new PromiseStatePool();

		let x = 2;
		pool.add("test1",(y)=>{
			x += 3*y;
		},(y)=>{
			x += 4*y;
		});
		pool.add("test2",(y)=>{
			x += 5*y;
		},(y)=>{
			x += 6*y;
		});
		pool.add("test2",(y)=>{
			x += 7*y;
		},(y)=>{
			x += 8*y;
		});
		pool.resolveAndReject("test2",2,3);
		assert.equal(38,x); // 2+5*2+7*2+4*3
	});
});
