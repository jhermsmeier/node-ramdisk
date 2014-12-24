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
  
}

/**
 * Maximum integer value
 * that can be handled safely
 * @type {Number}
 */
RamDisk.INT_MAX = Math.pow( 2, 53 )

/**
 * Partition Constructor
 * @param {Object} options
 *   @property {Number} firstLBA
 *   @property {Number} lastLBA
 * @type {Function}
 */
RamDisk.Partition = require( './partition' )

/**
 * RamDisk Prototype
 * @type {Object}
 */
RamDisk.prototype = {
  
  constructor: RamDisk,
  
  /**
   * Return a new partition
   * @param  {Object} options
   * @return {RamDisk.Partition}
   */
  partition: function( options ) {
    return new RamDisk.Partition( this, options )
  },
  
}

// Exports
module.exports = RamDisk
