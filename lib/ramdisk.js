/**
 * RamDisk Constructor
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
 * @type {Function}
 */
RamDisk.Partition = require( './partition' )

/**
 * RamDisk Prototype
 * @type {Object}
 */
RamDisk.prototype = {
  
  constructor: RamDisk,
  
}

// Exports
module.exports = RamDisk
