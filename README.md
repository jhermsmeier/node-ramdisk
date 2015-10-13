# RAMDisk
[![npm](http://img.shields.io/npm/v/ramdisk.svg?style=flat-square)](https://npmjs.com/ramdisk)
[![npm downloads](http://img.shields.io/npm/dm/ramdisk.svg?style=flat-square)](https://npmjs.com/ramdisk)
[![build status](http://img.shields.io/travis/jhermsmeier/node-ramdisk.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-ramdisk)

## Install via [npm](https://npmjs.com)

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
