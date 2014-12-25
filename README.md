# RAMDISK
[![npm](http://img.shields.io/npm/v/ramdisk.svg?style=flat)](https://npmjs.org/ramdisk)
[![npm downloads](http://img.shields.io/npm/dm/ramdisk.svg?style=flat)](https://npmjs.org/ramdisk)
[![build status](http://img.shields.io/travis/jhermsmeier/node-ramdisk.svg?style=flat)](https://travis-ci.org/jhermsmeier/node-ramdisk)

## Install via [npm](https://npmjs.org)

```sh
$ npm install ramdisk
```

## What? Why? How does it work?!

This is just the easiest & quickest cross-platform solution that I just happened to come up with at the time.
I mainly need it to test file system implementations and the like.
The API is pretty much the same as [blockdevice](https://github.com/jhermsmeier/node-blockdevice)'s,
which features some crappy documentation on it. It's most likely worse than just reading the code.
I'll work on it, I promise.

Thing is, it allocates sparsely (with the worst possible allocator (if you can even call it that) ever written to date) -
meaning - you can specify 4 GB as size & you won't occupy 4 GB of memory, until you actually write to every sector.

## Schrödinger's Issues

Issues that may, or may not appear during usage.

- The cluster allocator isn't tested very well, and might just not put your data somewhere
- Same thing goes for reading, but in reverse - you might not get it back out again
- Also, it doesn't allocate the defined size in advance, it's totally possible to run out of memory during operation
- Partitioning will most likely fail || break - I was lazy & just copied it from `blockdevice`
- That's all I can think of right now... If anything breaks, write an issue, please :)

## Usage

```js
var RamDisk = require( 'ramdisk' )
```

```js
// Options, with their defaults
var device = new RamDisk({
  // Emulated (?) device block size
  blockSize: 512,
  // Cluster size. It allocates in these.
  clusterSize: 4096,
  // The grand total (absolutely imaginary) size
  // of the entire contraption!
  size: 10 * 1024 * 1024,
})
```

```js
// Supplying a buffer to .readBlocks() is optional
var buffer = new Buffer( device.blockSize )

device.readBlocks(
  fromLBA, toLBA, buffer,
  function( error, buffer, bytesRead ) {
    // ...
  }
)
```
