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
  
  this.blockSize = options.blockSize || -1
  this.size = options.size || -1
  
}

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
