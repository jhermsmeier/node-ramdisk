/**
 * RamDisk Constructor
 * @param {Object} options
 *   @property {Number} blockSize
 *   @property {Number} size
 * @return {RamDisk}
 */
function RamDisk( options ) {
  
  if( !(this instanceof RamDisk) )
    return new RamDisk( options )
  
  options = options != null ?
    options : {}
  
  // Emulated device block size
  this.blockSize = options.blockSize || 512
  // Allocation cluster size (default 4 KB)
  this.clusterSize = options.clusterSize || 4096
  // Total size in bytes of device (default 10 MB)
  this.size = options.size || 1024 * 1024 * 10
  // Whether to scrub newly allocated clusters
  this.zerofill = options.zerofill != null ?
    !!options.zerofill : true
  
  if( this.clusterSize % this.blockSize !== 0 )
    throw new Error( 'Cluster size must be multiple of block size' )
  
  if( ( Math.log( this.blockSize ) / Math.LN2 ) % 1 !== 0 )
    throw new Error( 'Block size must be power of 2' )
  
  if( this.size < this.clusterSize )
    throw new Error( 'Disk size must be >= cluster size' )
  
  if( this.clusterSize < this.blockSize )
    throw new Error( 'Cluster size must be >= block size' )
  
  if( this.size > RamDisk.INT_MAX )
    throw new Error( 'Disk size may not exceed 2^53 bytes' )
  
  if( this.clusterCount > RamDisk.INT_MAX )
    throw new Error( 'Cluster count exceeds INT_MAX (2^53)' )
  
  // Init memory allocator/manager
  RamDisk.Memory.call( this )
  
}

/**
 * Maximum integer value
 * that can be handled safely
 * @type {Number}
 */
RamDisk.INT_MAX = Math.pow( 2, 53 )

/**
 * RamDisk Partition
 * @param {Object} options
 *   @property {Number} firstLBA
 *   @property {Number} lastLBA
 * @type {Function}
 */
RamDisk.Partition = require( './partition' )

/**
 * Memory Allocator
 * @type {Function}
 */
RamDisk.Memory = require( './memory' )

/**
 * RamDisk Prototype
 * @type {Object}
 */
RamDisk.prototype = {
  
  constructor: RamDisk,
  
  get sectorsPerCluster() {
    return this.clusterSize / this.blockSize
  },
  
  get clusterCount() {
    return Math.ceil( this.size / this.clusterSize )
  },
  
  /**
   * Return a new partition
   * @param  {Object} options
   * @return {RamDisk.Partition}
   */
  partition: function( options ) {
    return new RamDisk.Partition( this, options )
  },
  
  readBlocks: function( fromLBA, toLBA, buffer, callback ) {
    
    fromLBA = fromLBA || 0
    toLBA = toLBA || ( fromLBA + 1 )
    
    if( fromLBA > toLBA ) {
      var swap = fromLBA
      fromLBA = toLBA
      toLBA = swap
      swap = void 0
    }
    
    var done = callback.bind( this )
    var buffer = this._read( fromLBA, toLBA, buffer )
    
    setImmediate( function() {
      done( null, buffer, buffer.length )
    })
    
  },
  
  writeBlocks: function( fromLBA, buffer, callback ) {
    
    if( buffer.length % this.blockSize !== 0 ) {
      done( new Error( 'Buffer length not multiple of block size' ) )
      return
    }
    
    fromLBA = fromLBA || 0
    
    var done = callback.bind( this )
    var bytesWritten = this._write( fromLBA, buffer )
    
    setImmediate( function() {
      done( null, bytesWritten )
    })
    
  },
  
}

RamDisk.prototype.__proto__ =
  RamDisk.Memory.prototype
// Exports
module.exports = RamDisk
