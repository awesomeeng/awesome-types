# awesome-types
Collection of type classes for JavaScript.

# AwesomeTypes

Javascript data structure classes for Enterprise Ready nodejs applications

## Disclaimer

These are data structure classes largerly for use within the suite of applications for The Awesome Engineering Company. You are free to use it for your own purposes (MIT License), but keep in mind that we are only supporting it in relation to needs of our other applications. Thanks!

## Installation

```
npm install --save @awesomeeng/awesome-types
```

## Usage

Require it, then make calls against it. See below for documentation.

```
const AwesomeTypes = require("@awesomeeng/awesome-types");

...
let linkedlist = new AwesomeTypes.collections.LinkedList();
linkedlist.push("something 1");
linkedlist.unshift("something 2");
linkedlist.append("something 3");
linkedlist.prepend("something 4");
assert.equal(linkedlist.length,4);
assert.equal(linkedlist.first,"Something 4");
assert.equal(linkedlist.last,"Something 3");
assert.deepStrictEqual([...linkedlist],["something 4","something 2","something 1","something 3"]);
...
```

## Data structures currently implemented

#### AwesomeTypes.collections

Standard data structures we all know and love.

 - AwesomeTypes.collections.LinkedList
 - AwesomeTypes.collections.Queue
 - AwesomeTypes.collections.Stack
 - AwesomeTypes.collections.SortedList
 - AwesomeTypes.collections.CircularBuffer

#### AwesomeTypes.lockables

Standard data types built ontop of SharedArrayBuffer so they can be passed to workers, with additional support for Atomic locking.

 - AwesomeTypes.collections.LockableBuffer
 - AwesomeTypes.collections.LockableCircularBuffer

#### AwesomeTypes.processing

Non-standard dataq types specifically for dealing with syncronous and asyncronous javascript processing.

 - AwesomeTypes.processing.TimerPool

## Documentation

Please refer to the [API Documentation](./docs/API.md) for details.

## The Awesome Engineering Company

AwesomeLog is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

This product is maintained and supported by The Awesome Engineering Company.  For support please [file an issue](./issues) or contact us via our Webiste at [https://awesomeeng.com](https://awesomeeng.com).  We will do our best to respond to you in a timely fashion.

## License

AwesomeLog is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
